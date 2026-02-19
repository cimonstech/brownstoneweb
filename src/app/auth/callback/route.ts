import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type EmailOtpType = "invite" | "recovery" | "signup" | "email_change";

const ALLOWED_TYPES: EmailOtpType[] = ["invite", "recovery", "signup", "email_change"];

/**
 * Supabase redirects here after the user clicks the link in invite or password-reset email.
 * We verify the token, set the session, then redirect to set password or dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const redirectTo = searchParams.get("redirect_to")?.trim() || "";

  if (!tokenHash || !type || !ALLOWED_TYPES.includes(type)) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("error", "Invalid or expired link. Please request a new one.");
    return NextResponse.redirect(url);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("error", error.message || "Invalid or expired link.");
    return NextResponse.redirect(url);
  }

  // Redirect to the intended page. For invite/recovery, user must set password.
  const safeRedirect =
    redirectTo.startsWith("/admin/") && !redirectTo.startsWith("//")
      ? redirectTo
      : type === "invite" || type === "recovery"
        ? "/admin/update-password"
        : "/admin/dashboard";

  return NextResponse.redirect(new URL(safeRedirect, request.url));
}
