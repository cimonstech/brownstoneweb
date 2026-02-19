import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ManualContent } from "./ManualContent";

export default async function AdminManualPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return <ManualContent />;
}
