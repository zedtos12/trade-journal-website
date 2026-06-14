import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { MobileNavbarMenu } from "@/components/mobile-navbar-menu";
import { NavbarLinks } from "@/components/navbar-links";

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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Link href="/dashboard" data-testid="navbar-brand" className="group inline-flex min-h-11 min-w-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-2 pr-4 shadow-lg shadow-black/20 transition hover:border-gold/35 hover:bg-white/[0.07]">
            <Image src="/logo.svg" alt="Trade Journal Logo" width={36} height={36} className="h-9 w-9 rounded-full shadow-lg shadow-gold/20 transition group-hover:scale-105" priority />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight text-white">Trade Journal</span>
              <span className="block truncate text-[11px] uppercase tracking-[0.22em] text-gold/80">Performance OS</span>
            </span>
          </Link>

          <div data-testid="mobile-navbar-slot" className="lg:hidden">
            <MobileNavbarMenu />
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <div data-testid="navbar-links">
              <NavbarLinks links={navLinks} />
            </div>

            <div className="flex items-center gap-2">
              <Link href="/trades/new" className="premium-button rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-gold/20 transition hover:bg-goldLight">Add Trade</Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
    </main>
  );
}
