"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const noSidebarPaths = ["/admin/login", "/admin/reset-password"];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = noSidebarPaths.some((p) => pathname?.startsWith(p));

  if (hideSidebar) {
    return <div className="min-h-screen bg-neutral-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <aside className="w-56 bg-earthy text-white flex flex-col fixed inset-y-0">
        <div className="p-4 border-b border-white/10">
          <Link href="/admin/dashboard" className="font-bold text-white">
            Brownstone Admin
          </Link>
        </div>
        <nav className="p-2 flex flex-col gap-1">
          <Link
            href="/admin/dashboard"
            className="px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/posts"
            className="px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
          >
            Posts
          </Link>
          <Link
            href="/admin/profile"
            className="px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
          >
            Profile
          </Link>
          <Link
            href="/admin/users"
            className="px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
          >
            Users
          </Link>
        </nav>
        <div className="mt-auto p-4 border-t border-white/10">
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white"
          >
            Back to site
          </Link>
        </div>
      </aside>
      <main className="flex-1 ml-56 p-8">{children}</main>
    </div>
  );
}
