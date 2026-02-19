import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const log = logger.create("api:auth:reset-password");

const MAX_PER_EMAIL = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const { allowed } = checkRateLimit(email, "reset-password", MAX_PER_EMAIL, WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many reset requests for this email. Please try again later." },
      { status: 429 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const { allowed: ipAllowed } = checkRateLimit(ip, "reset-password-ip", 10, WINDOW_MS);
  if (!ipAllowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const origin = request.headers.get("origin") || request.nextUrl.origin;
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback`,
  });

  if (error) {
    log.error("Password reset request failed", error);
  }

  // Always return success to prevent email enumeration
  return NextResponse.json({ success: true });
}
