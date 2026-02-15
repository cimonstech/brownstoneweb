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

/**
 * Convert plain text to HTML for email body.
 * Double newlines → paragraphs; single newlines → <br>; escapes HTML.
 * Use when user pastes plain text into the template so the email looks rich without manual HTML.
 */
export function plainTextToHtml(plain: string): string {
  const escaped = plain
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const paragraphs = escaped
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length === 0) return "<p></p>";
  return paragraphs
    .map((p) => `<p>${p.replace(/\n/g, "<br>\n")}</p>`)
    .join("\n");
}

/** True if body looks like plain text (no HTML tags). */
export function looksLikePlainText(body: string): boolean {
  const trimmed = body.trim();
  return trimmed.length > 0 && !trimmed.includes("<");
}

/** Normalize template body: if plain text, convert to HTML before save. */
export function normalizeTemplateBody(body: string): string {
  return looksLikePlainText(body) ? plainTextToHtml(body) : body.trim();
}

/** Replace {{variable}} placeholders in template with contact data */
export function interpolateTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}
