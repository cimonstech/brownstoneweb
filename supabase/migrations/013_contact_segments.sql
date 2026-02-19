-- Named segments for grouping contacts (e.g. "Real clients", "US clients")
CREATE TABLE IF NOT EXISTS public.contact_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#6B7280',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_segments_name ON public.contact_segments(name);

ALTER TABLE public.contact_segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and moderators can manage segments"
  ON public.contact_segments FOR ALL TO authenticated
  USING (public.is_admin_or_moderator())
  WITH CHECK (public.is_admin_or_moderator());

-- Junction table: many-to-many between contacts and segments
CREATE TABLE IF NOT EXISTS public.contact_segment_members (
  segment_id UUID NOT NULL REFERENCES public.contact_segments(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (segment_id, contact_id)
);

CREATE INDEX IF NOT EXISTS idx_csm_contact ON public.contact_segment_members(contact_id);
CREATE INDEX IF NOT EXISTS idx_csm_segment ON public.contact_segment_members(segment_id);

ALTER TABLE public.contact_segment_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and moderators can manage segment members"
  ON public.contact_segment_members FOR ALL TO authenticated
  USING (public.is_admin_or_moderator())
  WITH CHECK (public.is_admin_or_moderator());
