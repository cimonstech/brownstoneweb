import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { getTemplateById, interpolateTemplate } from "./templates";
import { getContactById, addContactActivity } from "./contacts";
import { MAX_EMAILS_PER_DAY, MAX_EMAILS_PER_HOUR } from "./safety";

type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];
type CampaignInsert = Database["public"]["Tables"]["campaigns"]["Insert"];
type CampaignEmailInsert = Database["public"]["Tables"]["campaign_emails"]["Insert"];

export async function getCampaigns(
  supabase: SupabaseClient<Database>
): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getCampaignById(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function createCampaign(
  supabase: SupabaseClient<Database>,
  insert: CampaignInsert
): Promise<Campaign> {
  const { data, error } = await supabase
    .from("campaigns")
    .insert(insert as never)
    .select()
    .single();
  if (error) throw error;
  return data as Campaign;
}

export async function addContactsToCampaign(
  supabase: SupabaseClient<Database>,
  campaignId: string,
  contactIds: string[]
): Promise<void> {
  const inserts: CampaignEmailInsert[] = contactIds.map((contact_id) => ({
    campaign_id: campaignId,
    contact_id,
    step_index: 0,
    status: "pending",
  }));
  const { error } = await supabase.from("campaign_emails").upsert(inserts as never, {
    onConflict: "campaign_id,contact_id",
    ignoreDuplicates: true,
  });
  if (error) throw error;
}

export type CampaignEmailForSend = { id: string; contact_id: string };

export async function getCampaignEmailsForSending(
  supabase: SupabaseClient<Database>,
  campaignId: string,
  limit: number
): Promise<CampaignEmailForSend[]> {
  const { data, error } = await supabase
    .from("campaign_emails")
    .select("id, contact_id")
    .eq("campaign_id", campaignId)
    .eq("status", "pending")
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as CampaignEmailForSend[];
}

export async function getEmailsSentToday(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { count, error } = await supabase
    .from("campaign_emails")
    .select("id", { count: "exact", head: true })
    .eq("status", "sent")
    .gte("sent_at", startOfDay.toISOString());
  if (error) throw error;
  return count ?? 0;
}

export async function getEmailsSentThisHour(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const { count, error } = await supabase
    .from("campaign_emails")
    .select("id", { count: "exact", head: true })
    .eq("status", "sent")
    .gte("sent_at", oneHourAgo.toISOString());
  if (error) throw error;
  return count ?? 0;
}

export async function canSendMoreEmails(
  supabase: SupabaseClient<Database>
): Promise<{ ok: boolean; limit: string }> {
  const [today, thisHour] = await Promise.all([
    getEmailsSentToday(supabase),
    getEmailsSentThisHour(supabase),
  ]);
  if (today >= MAX_EMAILS_PER_DAY) {
    return { ok: false, limit: `Daily limit (${MAX_EMAILS_PER_DAY}) reached` };
  }
  if (thisHour >= MAX_EMAILS_PER_HOUR) {
    return { ok: false, limit: `Hourly limit (${MAX_EMAILS_PER_HOUR}) reached` };
  }
  return { ok: true, limit: "" };
}

export function buildContactVars(contact: {
  email: string;
  name: string | null;
  company: string | null;
  phone?: string | null;
}): Record<string, string> {
  return {
    first_name: contact.name?.split(" ")[0] ?? "there",
    full_name: contact.name ?? "there",
    email: contact.email,
    company: contact.company ?? "",
    phone: contact.phone ?? "",
  };
}
