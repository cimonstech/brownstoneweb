"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const noSidebarPaths = ["/admin/login", "/admin/reset-password", "/admin/update-password"];

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" as const },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/posts", label: "Posts", icon: "article" as const },
      { href: "/admin/categories", label: "Categories", icon: "folder" as const },
      { href: "/admin/media", label: "Media", icon: "image" as const },
      { href: "/admin/now-selling", label: "Signature Listings", icon: "home" as const },
    ],
  },
  {
    label: "Leads & CRM",
    items: [
      { href: "/admin/leads", label: "Leads", icon: "mail" as const },
      { href: "/admin/crm/contacts", label: "Contacts", icon: "people" as const },
      { href: "/admin/crm/pipeline", label: "Pipeline", icon: "pipeline" as const },
      { href: "/admin/crm/campaigns", label: "Campaigns", icon: "campaigns" as const },
      { href: "/admin/crm/templates", label: "Email Templates", icon: "templates" as const },
      { href: "/admin/crm/analytics", label: "Analytics", icon: "analytics" as const },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/admin/users", label: "Users", icon: "people" as const },
      { href: "/admin/roles", label: "Roles", icon: "badge" as const },
      { href: "/admin/audit-log", label: "Audit Log", icon: "audit" as const, adminOnly: true },
      { href: "/admin/profile", label: "Profile", icon: "person" as const },
      { href: "/admin/manual", label: "Manual", icon: "book" as const },
    ],
  },
] as const;

type NavIconName = "dashboard" | "article" | "folder" | "image" | "home" | "mail" | "people" | "pipeline" | "campaigns" | "templates" | "analytics" | "badge" | "person" | "audit" | "book";

function NavIcon({ name }: { name: NavIconName }) {
  const c = "w-5 h-5 shrink-0";
  switch (name) {
    case "dashboard":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
      );
    case "article":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
      );
    case "folder":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
      );
    case "image":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
      );
    case "badge":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 4c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v3H9V4zm9 16H6V9h3v2h6V9h3v11z"/></svg>
      );
    case "person":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      );
    case "people":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
      );
    case "home":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5zm0-2v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>
      );
    case "mail":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
      );
    case "pipeline":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
      );
    case "campaigns":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      );
    case "templates":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
      );
    case "analytics":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
      );
    case "audit":
      return (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9h-2V9.5C11 8.67 10.33 8 9.5 8S8 8.67 8 9.5V11H6V9.5C6 7.57 7.57 6 9.5 6S13 7.57 13 9.5V11zm-2 7H8v-2h3v2zm5-4H8v-2h8v2zm-1-9V3.5L18.5 9H13z"/></svg>
      );
    case "book":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
      );
    default:
      return null;
  }
}

type CurrentUser = {
  id: string;
  email?: string;
  fullName: string;
  avatarUrl?: string;
  roleLabel: string;
  isAdmin?: boolean;
  isAuthorOnly?: boolean;
};

const LEAD_POLL_INTERVAL = 30_000;

export function AdminShell({
  children,
  currentUser,
  leadCount: initialLeadCount = 0,
}: {
  children: React.ReactNode;
  currentUser?: CurrentUser | null;
  leadCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const hideSidebar = noSidebarPaths.some((p) => pathname?.startsWith(p));
  const isCrmPath = pathname?.startsWith("/admin/leads") || pathname?.startsWith("/admin/crm");
  const [crmOpen, setCrmOpen] = useState(isCrmPath);
  const [leadCount, setLeadCount] = useState(initialLeadCount);
  const isAuthorOnly = currentUser?.isAuthorOnly === true;

  useEffect(() => {
    setLeadCount(initialLeadCount);
  }, [initialLeadCount]);

  useEffect(() => {
    if (isCrmPath) setCrmOpen(true);
  }, [isCrmPath]);

  useEffect(() => {
    if (isAuthorOnly || !currentUser) return;
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/admin/lead-count");
        if (res.ok && active) {
          const { count } = await res.json();
          if (typeof count === "number") setLeadCount(count);
        }
      } catch {
        // silently ignore polling failures
      }
    };
    const id = setInterval(poll, LEAD_POLL_INTERVAL);
    poll();
    return () => { active = false; clearInterval(id); };
  }, [isAuthorOnly, currentUser]);

  async function handleLogout() {
    try {
      const supabase = createClient();
      if (supabase?.auth) {
        await supabase.auth.signOut();
      }
    } catch {
      // ignore signOut errors
    }
    window.location.href = "/admin/login";
  }

  if (hideSidebar) {
    return <div className="min-h-screen bg-[#F8F9FA]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <aside className="w-64 bg-[#411600] fixed inset-y-0 left-0 z-50 flex flex-col shadow-xl">
        <div className="p-6">
          <Link href="/admin/dashboard" className="text-[#fff] text-sm font-bold tracking-tight whitespace-nowrap hover:text-primary/90 transition-colors">
            Brownstone Admin
          </Link>
        </div>
        <nav className="flex-1 px-4 overflow-y-auto">
          {navSections.map((section) => {
            if (isAuthorOnly && section.label === "Leads & CRM") return null;
            const isCrmSection = section.label === "Leads & CRM";
            return (
              <div key={section.label} className="mb-6">
                <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#c4b5a8]">
                  {section.label}
                </p>
                {isCrmSection ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setCrmOpen((o) => !o)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all border-l-4 border-transparent text-[#e8e0dc] hover:text-[#fff] hover:bg-white/10"
                    >
                      <span className="flex items-center font-medium">
                        <span className="mr-3 text-[#e8e0dc]"><NavIcon name="people" /></span>
                        CRM
                      </span>
                      <svg
                        className={`w-5 h-5 shrink-0 transition-transform ${crmOpen ? "rotate-180" : ""}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                      </svg>
                    </button>
                    {crmOpen && (
                      <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-2">
                        {section.items
                          .filter((item) => {
                            const href = (item as { href: string }).href;
                            return href === "/admin/roles" ? currentUser?.isAdmin === true : true;
                          })
                          .map(({ href, label, icon }) => {
                          const active = pathname === href || pathname?.startsWith(href + "/");
                          const showLeadCount = href === "/admin/leads" && leadCount > 0;
                          return (
                            <Link
                              key={href}
                              href={href}
                              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group text-sm w-full ${
                                active
                                  ? "bg-primary/20 text-[#fff]"
                                  : "text-[#e8e0dc] hover:text-[#fff] hover:bg-white/10"
                              }`}
                            >
                              <span className="flex items-center">
                                <span className={active ? "text-primary mr-2" : "mr-2 text-[#e8e0dc] group-hover:text-primary"}><NavIcon name={icon} /></span>
                                <span className="font-medium text-inherit">{label}</span>
                              </span>
                              {showLeadCount && (
                                <span className="bg-primary/90 text-white text-[10px] font-bold min-w-[1.25rem] h-5 px-1.5 rounded-full flex items-center justify-center">
                                  {leadCount > 99 ? "99+" : leadCount}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-1">
                    {section.items
                      .filter((item) => {
                        const href = (item as { href: string }).href;
                        if ("adminOnly" in item && item.adminOnly && currentUser?.isAdmin !== true) return false;
                        if (href === "/admin/roles" && currentUser?.isAdmin !== true) return false;
                        if (isAuthorOnly && section.label === "Admin" && href !== "/admin/profile" && href !== "/admin/manual") return false;
                        return true;
                      })
                      .map(({ href, label, icon }) => {
                        const active = pathname === href || pathname?.startsWith(href + "/");
                        return (
                          <Link
                            key={href}
                            href={href}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all group border-l-4 ${
                              active
                                ? "bg-primary/20 border-primary text-[#fff]"
                                : "border-transparent text-[#e8e0dc] hover:text-[#fff] hover:bg-white/10"
                            }`}
                          >
                            <span className={active ? "text-primary mr-3" : "mr-3 text-[#e8e0dc] group-hover:text-primary"}><NavIcon name={icon} /></span>
                            <span className="font-medium text-inherit">{label}</span>
                          </Link>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center text-[#c4b5a8] hover:text-[#fff] text-sm transition-colors"
          >
            <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            Back to site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center w-full text-[#c4b5a8] hover:text-[#fff] text-sm transition-colors"
          >
            <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-[#F8F9FA] border-b border-slate-200/80">
          <form action="/admin/posts" method="GET" className="relative w-96 max-w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </span>
            <input
              type="search"
              name="search"
              placeholder="Search posts…"
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-sm outline-none transition-all"
            />
          </form>
          <div className="flex items-center gap-6">
            {!isAuthorOnly && (
              <Link
                href="/admin/leads"
                className="relative p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-white/80"
                aria-label={leadCount > 0 ? `${leadCount} leads` : "Leads"}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                {leadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[1.25rem] h-5 px-1.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#F8F9FA]">
                    {leadCount > 99 ? "99+" : leadCount}
                  </span>
                )}
              </Link>
            )}
            {currentUser && (
              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{currentUser.fullName}</p>
                    <p className="text-xs text-slate-400">{currentUser.roleLabel}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm ring-4 ring-primary/10 shrink-0">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      currentUser.fullName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
