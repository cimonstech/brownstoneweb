/**
 * Insert a lead into the unified leads table.
 * Use from API routes (requires admin/supabase client with service role).
 */

export type LeadSource = "contact" | "brochure" | "lakehouse" | "exit_intent" | "newsletter";

export type InsertLead = {
  email: string;
  phone?: string | null;
  country_code?: string | null;
  name?: string | null;
  message?: string | null;
  source: LeadSource;
  project?: string | null;
  consent?: boolean | null;
};
