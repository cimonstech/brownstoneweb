-- CRM: contacts table (one row per person, deduplicated by email)
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  country_code TEXT,
  company TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new_lead' CHECK (status IN (
    'new_lead', 'contacted', 'engaged', 'qualified', 'negotiation', 'converted', 'dormant'
  )),
  do_not_contact BOOLEAN DEFAULT false,
  unsubscribed BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON public.contacts USING GIN(tags);

-- contact_activities: every interaction (form submit, email sent, note, etc.)
CREATE TABLE IF NOT EXISTS public.contact_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'form_submit', 'email_sent', 'email_received', 'note', 'call', 'meeting'
  )),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_contact_activities_contact_id ON public.contact_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_activities_created_at ON public.contact_activities(created_at DESC);

-- Trigger to update updated_at on contacts
CREATE OR REPLACE FUNCTION public.update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contacts_updated_at ON public.contacts;
CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_contacts_updated_at();

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_activities ENABLE ROW LEVEL SECURITY;

-- Admins and moderators can manage contacts (uses existing is_admin_or_moderator)
CREATE POLICY "Admins and moderators can manage contacts"
  ON public.contacts FOR ALL TO authenticated
  USING (public.is_admin_or_moderator())
  WITH CHECK (public.is_admin_or_moderator());

CREATE POLICY "Admins and moderators can manage contact_activities"
  ON public.contact_activities FOR ALL TO authenticated
  USING (public.is_admin_or_moderator())
  WITH CHECK (public.is_admin_or_moderator());
