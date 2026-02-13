import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type EmailTemplate = Database["public"]["Tables"]["email_templates"]["Row"];
type EmailTemplateInsert = Database["public"]["Tables"]["email_templates"]["Insert"];
type EmailTemplateUpdate = Database["public"]["Tables"]["email_templates"]["Update"];

export async function getTemplates(
  supabase: SupabaseClient<Database>
): Promise<EmailTemplate[]> {
  const { data, error } = await supabase
    .from("email_templates")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getTemplateById(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<EmailTemplate | null> {
  const { data, error } = await supabase
    .from("email_templates")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function createTemplate(
  supabase: SupabaseClient<Database>,
  insert: EmailTemplateInsert
): Promise<EmailTemplate> {
  const { data, error } = await supabase
    .from("email_templates")
    .insert(insert as never)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTemplate(
  supabase: SupabaseClient<Database>,
  id: string,
  update: EmailTemplateUpdate
): Promise<EmailTemplate> {
  const { data, error } = await supabase
    .from("email_templates")
    .update(update as never)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTemplate(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase.from("email_templates").delete().eq("id", id);
  if (error) throw error;
}

/** Replace {{variable}} placeholders in template with contact data */
export function interpolateTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}
