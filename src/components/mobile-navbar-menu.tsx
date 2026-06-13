"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/logout-button";

const mobileNavLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/trades", label: "Trades" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

export function MobileNavbarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div data-testid="mobile-navbar-slot" className="relative lg:hidden">
      <button
        data-testid="navbar-mobile-toggle"
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="mobile-navigation-menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-100 shadow-lg shadow-black/20 transition hover:border-gold/35 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-gold/30"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open ? (
        <div
          id="mobile-navigation-menu"
          data-testid="mobile-navigation-menu"
          className="animate-scale-in absolute right-0 top-full z-[70] mt-3 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <div className="mb-3 rounded-2xl border border-gold/15 bg-gold/[0.06] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-goldLight">Menu</p>
            <p className="mt-1 text-sm text-slate-300">Navigate Trade Journal from mobile.</p>
          </div>

          <nav aria-label="Mobile primary navigation" className="space-y-2">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-gold/35 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                {link.label}
                <span aria-hidden="true" className="text-goldLight">→</span>
              </Link>
            ))}
          </nav>

          <div className="mt-3 grid gap-2 border-t border-white/10 pt-3">
            <Link
              href="/trades/new"
              onClick={() => setOpen(false)}
              className="premium-button flex min-h-11 items-center justify-center rounded-2xl bg-gold px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-gold/20 transition hover:bg-goldLight focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              Add Trade
            </Link>
            <LogoutButton />
          </div>
        </div>
      ) : null}
    </div>
  );
}
