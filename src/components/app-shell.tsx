import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <header className="border-b border-white/10 bg-slate-950/70 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/dashboard" className="font-semibold">Trade Journal</Link>
          <nav aria-label="Primary navigation" className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300 sm:gap-4">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/trades" className="hover:text-white">Trades</Link>
            <Link href="/analytics" className="hover:text-white">Analytics</Link>
            <Link href="/settings" className="hover:text-white">Settings</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
    </main>
  );
}
