"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavbarLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav data-testid="navbar-links" aria-label="Primary navigation" className="flex items-center gap-1 rounded-full border border-red-500 bg-red-500 p-1.5 text-sm font-medium shadow-inner shadow-white/[0.03]">
      <div className="text-white font-bold text-2xl px-8 py-2">🚨 DASHBOARD DOANG 🚨</div>
    </nav>
  );
}