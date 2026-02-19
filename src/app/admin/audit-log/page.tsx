import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { AuditLogClient } from "./AuditLogClient";

export default async function AdminAuditLogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const roles = await getUserRoles();
  if (!roles.includes("admin")) {
    redirect("/admin/dashboard");
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Audit Log</h2>
        <p className="text-slate-500 mt-1">
          Complete record of all admin actions, including IP addresses and timestamps.
        </p>
      </div>
      <AuditLogClient />
    </div>
  );
}
