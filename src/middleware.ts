import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const adminPaths = ["/admin", "/admin/dashboard", "/admin/posts", "/admin/profile", "/admin/users"];
const adminPathPrefix = "/admin/";

function isAdminRoute(pathname: string): boolean {
  if (pathname === "/admin" || pathname === "/admin/login" || pathname === "/admin/reset-password") {
    return false;
  }
  return pathname.startsWith(adminPathPrefix);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update Supabase session (refresh token if needed)
  let response = await updateSession(request);

  // Protect admin routes (except login and reset-password)
  if (isAdminRoute(pathname)) {
    // Check auth via cookie / Supabase session is done in updateSession
    // Here we only redirect; actual role check can be done in layout or page
    const sessionCookie = request.cookies.get("sb-")?.value ?? request.cookies.getAll().find((c) => c.name.startsWith("sb-"));
    const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.value?.length > 0);

    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
