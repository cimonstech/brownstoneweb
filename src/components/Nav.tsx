"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaIcon } from "@/components/Icons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export type NavVariant = "solid" | "transparent";

type NavProps = {
  activePath?: string;
  variant?: NavVariant;
};

export default function Nav({ activePath = "/", variant = "solid" }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isTransparent = variant === "transparent";

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [mobileOpen]);

  const linkClass = (href: string) => {
    const base = "text-sm font-semibold uppercase tracking-wider transition-colors py-4 md:py-0";
    const active = href === activePath ? "text-primary" : "";
    if (isTransparent) {
      return `${base} text-white hover:text-primary ${active}`;
    }
    return `${base} text-earthy hover:text-primary ${active}`;
  };

  return (
    <header
      className={
        isTransparent
          ? "absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-16 py-6 md:py-8"
          : "fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-earthy/10"
      }
    >
      <div className="max-w-7xl mx-auto h-14 sm:h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/BrownStone.png"
            alt="Brownstone Construction Limited"
            width={86}
            height={26}
            className="h-4 sm:h-5 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/contact"
            className="hidden sm:flex min-w-[100px] sm:min-w-[120px] items-center justify-center rounded-lg h-10 sm:h-11 px-5 sm:px-6 bg-primary text-white text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Contact Us
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden size-12 flex items-center justify-center rounded-lg text-earthy hover:bg-earthy/5 transition-colors touch-manipulation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <FaIcon name={mobileOpen ? "xmark" : "bars"} className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-earthy/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
        <nav
          className={`absolute top-full left-0 right-0 bg-white border-t border-earthy/10 shadow-xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          <div className="px-4 py-6 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto safe-area-pb">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block ${linkClass(href)} border-b border-earthy/5 last:border-0`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex sm:hidden mt-4 items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
