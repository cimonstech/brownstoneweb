import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];
type ContactActivity = Database["public"]["Tables"]["contact_activities"]["Row"];
type ContactActivityInsert = Database["public"]["Tables"]["contact_activities"]["Insert"];

export type ContactFilters = {
  status?: string;
  search?: string;
  tags?: string[];
  source?: string;
};

export async function getContacts(
  supabase: SupabaseClient<Database>,
  filters: ContactFilters = {},
  limit = 100
): Promise<Contact[]> {
  let query = supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.source) {
    query = query.eq("source", filters.source);
  }
  if (filters.search?.trim()) {
    const term = filters.search.trim();
    query = query.or(
      `email.ilike.%${term}%,name.ilike.%${term}%,company.ilike.%${term}%`
    );
  }
  if (filters.tags && filters.tags.length > 0) {
    query = query.contains("tags", filters.tags);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Contact[];
}

export async function getContactById(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<Contact | null> {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Contact;
}

export async function getContactByEmail(
  supabase: SupabaseClient<Database>,
  email: string
): Promise<Contact | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("email", normalized)
    .maybeSingle();
  if (error) throw error;
  return data as Contact | null;
}

export async function createContact(
  supabase: SupabaseClient<Database>,
  insert: ContactInsert
): Promise<Contact> {
  const { data, error } = await supabase
    .from("contacts")
    .insert(insert as never)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateContact(
  supabase: SupabaseClient<Database>,
  id: string,
  update: ContactUpdate
): Promise<Contact> {
  const { data, error } = await supabase
    .from("contacts")
    .update(update as never)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Contact;
}

export async function upsertContactByEmail(
  supabase: SupabaseClient<Database>,
  email: string,
  data: Partial<ContactInsert>
): Promise<Contact> {
  const { data: existing } = await supabase
    .from("contacts")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .single();

  const existingContact = existing as Contact | null;
  if (existingContact) {
    return updateContact(supabase, existingContact.id, {
      ...data,
      name: data.name ?? existingContact.name,
      phone: data.phone ?? existingContact.phone,
      company: data.company ?? existingContact.company,
    });
  }

  return createContact(supabase, {
    email: email.toLowerCase().trim(),
    ...data,
  });
}

export async function addContactActivity(
  supabase: SupabaseClient<Database>,
  insert: ContactActivityInsert
): Promise<void> {
  const { error } = await supabase.from("contact_activities").insert(insert as never);
  if (error) throw error;
}

export async function getContactActivities(
  supabase: SupabaseClient<Database>,
  contactId: string,
  limit = 50
) {
  const { data, error } = await supabase
    .from("contact_activities")
    .select("*")
    .eq("contact_id", contactId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ContactActivity[];
}
