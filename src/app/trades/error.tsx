"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function TradesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <AppShell>
      <div data-testid="trade-error-state" className="premium-card animate-fade-up rounded-3xl border-rose-400/30 bg-rose-500/10 p-8 text-center">
        <p className="text-sm text-rose-200">Trade history error</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Gagal memuat trade history</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">Coba reload data. Jika masih gagal, cek koneksi database dan session login.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={() => reset()} className="premium-button rounded-full bg-gold px-5 py-3 font-semibold text-slate-950 hover:bg-goldLight">Try again</button>
          <Link href="/dashboard" className="premium-button rounded-full border border-white/10 px-5 py-3 font-semibold text-white hover:border-gold/50 hover:bg-white/5">Back to dashboard</Link>
        </div>
      </div>
    </AppShell>
  );
}
