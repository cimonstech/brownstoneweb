import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { NowSellingForm } from "./NowSellingForm";

export default async function AdminNowSellingPage() {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    redirect("/admin/dashboard");
  }

  const { data: rows } = await supabase
    .from("now_selling")
    .select("position, image_url, property_name, project_link")
    .order("position");

  const initialSlots = (rows ?? []).map((r) => ({
    position: r.position,
    image_url: r.image_url ?? null,
    property_name: r.property_name ?? null,
    project_link: r.project_link ?? null,
  }));

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Signature Listings</h2>
        <p className="text-slate-500 mt-1">
          Four properties shown in the blog sidebar. Images from media (portrait). Tone is understated; no pushy sales language.
        </p>
      </div>
      <NowSellingForm initialSlots={initialSlots} />
    </div>
  );
}
