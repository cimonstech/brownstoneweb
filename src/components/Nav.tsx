"use client";

import Link from "next/link";
import Image from "next/image";

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
  const isTransparent = variant === "transparent";
  const linkClass = (href: string) => {
    const base = "text-sm font-semibold uppercase tracking-wider transition-colors";
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
          ? "absolute top-0 left-0 right-0 z-50 px-6 lg:px-16 py-10"
          : "fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-earthy/10"
      }
    >
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/BrownStone.png"
            alt="Brownstone Construction Limited"
            width={86}
            height={26}
            className="h-5 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className={`flex min-w-[120px] items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 ${isTransparent ? "" : ""}`}
        >
          Contact Us
        </Link>
      </div>
    </header>
  );
}
