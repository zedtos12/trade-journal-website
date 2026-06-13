import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/trades", label: "Trades" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <header data-testid="premium-navbar" className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 px-4 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" data-testid="navbar-brand" className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-2 pr-4 shadow-lg shadow-black/20 transition hover:border-gold/35 hover:bg-white/[0.07]">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gold to-goldLight text-sm font-black text-slate-950 shadow-lg shadow-gold/20 transition group-hover:scale-105">TJ</span>
              <span>
                <span className="block text-sm font-semibold tracking-tight text-white">Trade Journal</span>
                <span className="block text-[11px] uppercase tracking-[0.22em] text-gold/80">Performance OS</span>
              </span>
            </Link>
            <Link href="/trades/new" className="premium-button inline-flex rounded-full bg-gold px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-gold/20 transition hover:bg-goldLight lg:hidden">Add Trade</Link>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between lg:justify-end">
            <nav data-testid="navbar-links" aria-label="Primary navigation" className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-sm text-slate-300 shadow-inner shadow-white/[0.03]">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/30">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/trades/new" className="premium-button hidden rounded-full bg-gold px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-gold/20 transition hover:bg-goldLight lg:inline-flex">Add Trade</Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
    </main>
  );
}
