-- Unified leads table: all form submissions (contact, brochure, lakehouse, exit_intent, newsletter)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  country_code TEXT,
  name TEXT,
  message TEXT,
  source TEXT NOT NULL CHECK (source IN ('contact', 'brochure', 'lakehouse', 'exit_intent', 'newsletter')),
  project TEXT,
  consent BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Service role can insert (from API routes)
CREATE POLICY "Service role inserts leads"
  ON public.leads FOR INSERT TO service_role
  WITH CHECK (true);

-- Admin and moderator can select
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.roles r
    JOIN public.user_roles ur ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE POLICY "Admins and moderators can view leads"
  ON public.leads FOR SELECT TO authenticated
  USING (public.is_admin_or_moderator());
