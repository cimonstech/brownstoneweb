import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { checkRateLimit } from "@/lib/rate-limit";

/* ------------------------------------------------------------------ */
/*  Rate-limit config for public form endpoints                       */
/* ------------------------------------------------------------------ */

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/contact": { max: 5, windowMs: 60_000 },
  "/api/brochure": { max: 5, windowMs: 60_000 },
  "/api/lakehouse-leads": { max: 5, windowMs: 60_000 },
  "/api/newsletter": { max: 10, windowMs: 60_000 },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isAdminRoute(pathname: string): boolean {
  const publicAdminPaths = ["/admin/login", "/admin/reset-password", "/admin/update-password"];
  if (publicAdminPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return false;
  }
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isApiMutatingRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

/* ------------------------------------------------------------------ */
/*  Middleware                                                        */
/* ------------------------------------------------------------------ */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // --- Rate limiting on public form POSTs ---
  if (method === "POST") {
    const rateConfig = RATE_LIMITS[pathname];
    if (rateConfig) {
      const ip = getClientIp(request);
      const { allowed, remaining, resetMs } = checkRateLimit(
        ip,
        pathname,
        rateConfig.max,
        rateConfig.windowMs
      );
      if (!allowed) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil(resetMs / 1000)),
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
      const response = await continueWithSession(request);
      response.headers.set("X-RateLimit-Remaining", String(remaining));
      return response;
    }
  }

  // --- CSRF Origin check on mutating API requests ---
  if (
    isApiMutatingRoute(pathname) &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(method)
  ) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json(
            { error: "Forbidden: origin mismatch" },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Forbidden: invalid origin" },
          { status: 403 }
        );
      }
    }
  }

  // --- Protect admin routes with real session validation ---
  if (isAdminRoute(pathname)) {
    const { response, hasValidSession } = await updateSessionWithValidation(request);
    if (!hasValidSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // --- Default: refresh session ---
  return await updateSession(request);
}

/**
 * Refresh the Supabase session AND validate that a real user exists.
 */
async function updateSessionWithValidation(
  request: NextRequest
): Promise<{ response: NextResponse; hasValidSession: boolean }> {
  const { createServerClient } = await import("@supabase/ssr");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = NextResponse.next({ request });

  if (!supabaseUrl || !supabaseAnonKey) {
    return { response, hasValidSession: false };
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { response, hasValidSession: !error && !!user };
}

async function continueWithSession(request: NextRequest): Promise<NextResponse> {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
