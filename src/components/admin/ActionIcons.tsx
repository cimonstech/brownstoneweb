"use client";

import Link from "next/link";

/**
 * Shared action icons for admin tables and detail pages.
 * Use with title/aria-label for accessibility.
 */
const cn = "w-5 h-5 shrink-0";

export function IconView({ className }: { className?: string }) {
  return (
    <svg className={className ?? cn} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  );
}

export function IconEdit({ className }: { className?: string }) {
  return (
    <svg className={className ?? cn} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

export function IconDelete({ className }: { className?: string }) {
  return (
    <svg className={className ?? cn} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  );
}

export function IconPerson({ className }: { className?: string }) {
  return (
    <svg className={className ?? cn} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export function IconPersonAdd({ className }: { className?: string }) {
  return (
    <svg className={className ?? cn} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v14h10v-2H6v-4h9v-2H6v-2z" />
    </svg>
  );
}

/** Icon-only button wrapper for table/detail actions */
const iconButtonClass =
  "inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/20";

export function ViewButton({
  href,
  "aria-label": ariaLabel = "View",
  title = "View",
}: {
  href: string;
  "aria-label"?: string;
  title?: string;
}) {
  return (
    <Link
      href={href}
      className={`${iconButtonClass} text-slate-500 hover:text-primary hover:bg-primary/10`}
      aria-label={ariaLabel}
      title={title}
    >
      <IconView />
    </Link>
  );
}

export function EditButton({
  href,
  "aria-label": ariaLabel = "Edit",
  title = "Edit",
}: {
  href: string;
  "aria-label"?: string;
  title?: string;
}) {
  return (
    <Link
      href={href}
      className={`${iconButtonClass} text-slate-500 hover:text-primary hover:bg-primary/10`}
      aria-label={ariaLabel}
      title={title}
    >
      <IconEdit />
    </Link>
  );
}

export function DeleteButton({
  onClick,
  disabled,
  loading,
  "aria-label": ariaLabel = "Delete",
  title = "Delete",
  className = "text-red-600 hover:text-red-700 hover:bg-red-50",
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  "aria-label"?: string;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${iconButtonClass} ${className}`}
      aria-label={ariaLabel}
      title={title}
    >
      {loading ? <span className="text-xs font-medium">…</span> : <IconDelete />}
    </button>
  );
}
