"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavbarLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav data-testid="navbar-links" aria-label="Primary navigation" className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-sm font-medium shadow-inner shadow-white/[0.03]">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 transition-all ${
              isActive
                ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
            } focus:outline-none focus:ring-2 focus:ring-gold/30`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}