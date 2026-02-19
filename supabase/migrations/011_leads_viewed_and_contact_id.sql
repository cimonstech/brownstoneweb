-- When an admin/moderator opens the Leads page, we store last_viewed_at so the badge shows only "new" leads (created after that).
CREATE TABLE IF NOT EXISTS public.admin_lead_views (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_lead_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own lead view timestamp"
  ON public.admin_lead_views FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Track which lead was added to which contact (so we can show "Already added" with link).
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_leads_contact_id ON public.leads(contact_id) WHERE contact_id IS NOT NULL;
