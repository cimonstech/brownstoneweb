-- ============================================================
-- PHASE 1: Blog backend schema (Supabase)
-- Run in Supabase SQL Editor or via supabase db push
-- ============================================================

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Roles
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. User roles (many-to-many)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- 4. Posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB,
  excerpt TEXT,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);

-- Updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Seed roles
-- ============================================================
INSERT INTO public.roles (name, description) VALUES
  ('admin', 'Full access: posts, users, roles'),
  ('moderator', 'Edit & publish any post'),
  ('author', 'Create & edit own drafts, submit for review')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role names
CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid UUID)
RETURNS SETOF TEXT AS $$
  SELECT r.name FROM public.roles r
  JOIN public.user_roles ur ON ur.role_id = r.id
  WHERE ur.user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Roles: read-only for authenticated
CREATE POLICY "Authenticated can read roles"
  ON public.roles FOR SELECT TO authenticated USING (true);

-- User roles: admins manage; users can read own
CREATE POLICY "Admins can manage user_roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin'));

CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Posts: public read published only; authors/moderators/admins by policy
CREATE POLICY "Public can read published posts"
  ON public.posts FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can create posts (own)"
  ON public.posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name IN ('author', 'moderator', 'admin')));

CREATE POLICY "Authors can update own drafts"
  ON public.posts FOR UPDATE TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Moderators and admins can update any post"
  ON public.posts FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name IN ('moderator', 'admin')))
  WITH CHECK (true);

CREATE POLICY "Moderators and admins can delete any post"
  ON public.posts FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name IN ('moderator', 'admin')));

-- Auto-create profile on signup (Supabase Auth hook or trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create profile on signup: use Supabase Dashboard -> Authentication -> Hooks
-- Add "Create user" hook that calls an Edge Function or use the SQL below if your project allows.
-- If you get permission error, create profile from your app after first sign-in (e.g. in middleware or API).
-- Optional trigger (run in SQL Editor with service role; may require Supabase to allow auth trigger):
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
