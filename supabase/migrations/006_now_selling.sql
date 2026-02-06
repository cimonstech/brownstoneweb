-- Now Selling: 4 slots for sidebar carousel (image, property name, project link)
-- Admin/moderator only can manage; public can read.

CREATE TABLE IF NOT EXISTS public.now_selling (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INT NOT NULL CHECK (position >= 1 AND position <= 4),
  image_url TEXT,
  property_name TEXT,
  project_link TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(position)
);

CREATE INDEX IF NOT EXISTS idx_now_selling_position ON public.now_selling(position);

ALTER TABLE public.now_selling ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public can read now_selling"
  ON public.now_selling FOR SELECT USING (true);

-- Admin and moderator can manage
CREATE POLICY "Admins and moderators can manage now_selling"
  ON public.now_selling FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name IN ('admin', 'moderator')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name IN ('admin', 'moderator')));

-- Trigger for updated_at
CREATE TRIGGER now_selling_updated_at
  BEFORE UPDATE ON public.now_selling
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
