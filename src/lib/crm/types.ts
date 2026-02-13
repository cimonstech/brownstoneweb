import type { ContactStatus, ContactActivityType } from "@/lib/supabase/types";

export type { ContactStatus, ContactActivityType };

export type ContactSource =
  | "website_form"
  | "cold_outreach"
  | "newsletter"
  | "referral"
  | "event"
  | "apollo"
  | "contact"
  | "brochure"
  | "lakehouse"
  | "exit_intent";

export const CONTACT_STATUSES: ContactStatus[] = [
  "new_lead",
  "contacted",
  "engaged",
  "qualified",
  "negotiation",
  "converted",
  "dormant",
];

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  new_lead: "New lead",
  contacted: "Contacted",
  engaged: "Engaged",
  qualified: "Qualified",
  negotiation: "Negotiation",
  converted: "Converted",
  dormant: "Dormant",
};

export const ACTIVITY_TYPE_LABELS: Record<ContactActivityType, string> = {
  form_submit: "Form submit",
  email_sent: "Email sent",
  email_received: "Email received",
  note: "Note",
  call: "Call",
  meeting: "Meeting",
};

export const SUGGESTED_TAGS = {
  buyer_type: ["investor", "homebuyer", "commercial"],
  interest: ["residential", "commercial", "partnership"],
  temperature: ["cold", "warm", "hot"],
} as const;
