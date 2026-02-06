-- ============================================================
-- Categories, post_categories, read_time, featured, archives
-- Run after 001_blog_schema.sql
-- ============================================================

-- Categories (admin-managed)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Post <-> Category (many-to-many)
CREATE TABLE IF NOT EXISTS public.post_categories (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_post_categories_post ON public.post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category ON public.post_categories(category_id);

-- Add to posts
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS read_time_minutes INT,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- Categories: public read; only admin can mutate (or moderator if you prefer)
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name = 'admin'));

-- Post categories: public read; authors/moderators/admins can manage for posts they can edit
CREATE POLICY "Post categories are viewable by everyone"
  ON public.post_categories FOR SELECT USING (true);

CREATE POLICY "Authors can set categories on own posts"
  ON public.post_categories FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name IN ('moderator', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_categories.post_id AND (p.author_id = auth.uid() OR EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name IN ('moderator', 'admin'))))
  );
