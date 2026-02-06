-- ============================================================
-- Invites, audit log, permissions, profile email
-- Run after 002_blog_categories_featured.sql
-- ============================================================

-- 1. Add email to profiles (synced from auth.users)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Sync email from auth to profile and apply pending invite (assign role)
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS TRIGGER AS $$
DECLARE
  inv RECORD;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  FOR inv IN SELECT id, role_id FROM public.invites WHERE email = LOWER(NEW.email) AND used_at IS NULL LIMIT 1
  LOOP
    INSERT INTO public.user_roles (user_id, role_id) VALUES (NEW.id, inv.role_id) ON CONFLICT DO NOTHING;
    UPDATE public.invites SET used_at = NOW() WHERE id = inv.id;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users: run in Supabase SQL Editor (Dashboard > SQL) if not already present:
--   CREATE TRIGGER on_auth_user_created
--     AFTER INSERT OR UPDATE OF email ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION public.sync_profile_email();

-- 2. Invites (pending role assignment when user signs up)
CREATE TABLE IF NOT EXISTS public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  invited_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_invites_email ON public.invites(email);
CREATE INDEX IF NOT EXISTS idx_invites_used_at ON public.invites(used_at) WHERE used_at IS NULL;

ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invites"
  ON public.invites FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name = 'admin'));

-- 3. Role audit log
CREATE TABLE IF NOT EXISTS public.role_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('assigned', 'removed')),
  role_name TEXT NOT NULL,
  performed_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_role_audit_target ON public.role_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_created ON public.role_audit_log(created_at DESC);

ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read role audit"
  ON public.role_audit_log FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name = 'admin'));

CREATE POLICY "Admins can insert role audit"
  ON public.role_audit_log FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name = 'admin'));

-- 4. Permissions (granular)
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read permissions"
  ON public.permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can read role_permissions"
  ON public.role_permissions FOR SELECT TO authenticated USING (true);

-- Seed permissions
INSERT INTO public.permissions (name, description) VALUES
  ('posts:write', 'Create and edit own posts'),
  ('posts:publish', 'Publish any post'),
  ('categories:manage', 'Create, edit, delete categories'),
  ('users:manage', 'Invite users and assign roles'),
  ('roles:manage', 'Create, edit, delete roles'),
  ('audit:read', 'View role audit log')
ON CONFLICT (name) DO NOTHING;

-- Map existing roles to permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.name IN ('posts:write', 'posts:publish', 'categories:manage', 'users:manage', 'audit:read')
WHERE r.name = 'moderator'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.name = 'posts:write'
WHERE r.name = 'author'
ON CONFLICT DO NOTHING;

-- Helper: get user permission names
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_uuid UUID)
RETURNS SETOF TEXT AS $$
  SELECT p.name FROM public.permissions p
  JOIN public.role_permissions rp ON rp.permission_id = p.id
  JOIN public.user_roles ur ON ur.role_id = rp.role_id
  WHERE ur.user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Allow admins to manage roles (create/edit/delete)
CREATE POLICY "Admins can insert roles"
  ON public.roles FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name = 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.roles FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name = 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.roles FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name = 'admin'));
