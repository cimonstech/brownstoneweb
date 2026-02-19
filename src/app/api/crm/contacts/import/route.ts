import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { logAuditFromRequest } from "@/lib/audit";

const log = logger.create("api:crm:contacts:import");

const ALLOWED_STATUSES = ["new_lead", "contacted", "engaged", "qualified", "negotiation", "converted", "dormant"];

const rowSchema = z.object({
  email: z.string().email(),
  name: z.string().max(200).optional(),
  phone: z.string().max(50).optional(),
  country_code: z.string().max(10).optional(),
  company: z.string().max(200).optional(),
  source: z.string().max(100).optional(),
  status: z.string().refine((s) => ALLOWED_STATUSES.includes(s), { message: "Invalid status" }).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

const importSchema = z.object({
  contacts: z.array(rowSchema).min(1).max(5000),
  segment_ids: z.array(z.string().uuid()).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = importSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { contacts, segment_ids } = parsed.data;
  const results = { created: 0, updated: 0, failed: 0, errors: [] as string[] };

  for (const row of contacts) {
    try {
      const email = row.email.trim().toLowerCase();

      const { data: existing } = await supabase
        .from("contacts")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        const update: Record<string, unknown> = {};
        if (row.name?.trim()) update.name = row.name.trim();
        if (row.phone?.trim()) update.phone = row.phone.trim();
        if (row.country_code?.trim()) update.country_code = row.country_code.trim();
        if (row.company?.trim()) update.company = row.company.trim();
        if (row.source?.trim()) update.source = row.source.trim();
        if (row.status) update.status = row.status;
        if (row.tags?.length) update.tags = row.tags;

        if (Object.keys(update).length > 0) {
          await supabase.from("contacts").update(update as never).eq("id", existing.id);
        }

        if (segment_ids?.length) {
          for (const sid of segment_ids) {
            await supabase
              .from("contact_segment_members")
              .upsert({ segment_id: sid, contact_id: existing.id } as never, {
                onConflict: "segment_id,contact_id",
              });
          }
        }

        results.updated++;
      } else {
        const { data: created, error: insertErr } = await supabase
          .from("contacts")
          .insert({
            email,
            name: row.name?.trim() || null,
            phone: row.phone?.trim() || null,
            country_code: row.country_code?.trim() || null,
            company: row.company?.trim() || null,
            source: row.source?.trim() || null,
            status: row.status ?? "new_lead",
            tags: row.tags ?? [],
          } as never)
          .select("id")
          .single();

        if (insertErr) throw insertErr;

        if (segment_ids?.length && created) {
          for (const sid of segment_ids) {
            await supabase
              .from("contact_segment_members")
              .insert({ segment_id: sid, contact_id: created.id } as never);
          }
        }

        results.created++;
      }
    } catch (err) {
      results.failed++;
      const msg = `Row ${row.email}: ${err instanceof Error ? err.message : "Unknown error"}`;
      if (results.errors.length < 20) results.errors.push(msg);
      log.warn("Import row failed", { email: row.email, err });
    }
  }

  logAuditFromRequest(request, {
    userId: user.id,
    userEmail: user.email,
    action: "import",
    resourceType: "contact",
    description: `Imported contacts: ${results.created} created, ${results.updated} updated, ${results.failed} failed`,
    metadata: results,
  }).catch(() => {});
  return NextResponse.json(results);
}
