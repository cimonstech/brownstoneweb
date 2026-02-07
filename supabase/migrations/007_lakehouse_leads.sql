-- Lakehouse email leads (Private Jetty CTA)
CREATE TABLE IF NOT EXISTS public.lakehouse_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lakehouse_leads_email ON public.lakehouse_leads(email);
CREATE INDEX IF NOT EXISTS idx_lakehouse_leads_created_at ON public.lakehouse_leads(created_at);

ALTER TABLE public.lakehouse_leads ENABLE ROW LEVEL SECURITY;

-- Only service role can insert/select; anon has no access
CREATE POLICY "Service role manages lakehouse_leads"
  ON public.lakehouse_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
