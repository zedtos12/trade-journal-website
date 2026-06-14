import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { TradeForm } from "@/components/trade-form";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeTrade } from "@/lib/trades/serialize";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditTradePage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const trade = await prisma.trade.findFirst({ where: { id, userId: user.id } });
  if (!trade) notFound();

  return (
    <AppShell>
      <div data-testid="trade-form-layout" className="mx-auto max-w-5xl">
        <Link href={`/trades/${id}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition hover:border-gold/35 hover:text-white">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H6.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L6.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" /></svg>
          Back to detail
        </Link>
        <div className="premium-card animate-fade-up relative mt-6 overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(244,213,141,0.12),transparent_30%)]" />
          <div className="relative">
            <p className="inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-goldLight">Edit trade</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Update {trade.pair}</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Update manual trade journal sesuai data review terbaru. Pastikan risk management dan notes tetap up to date.</p>
          </div>
        </div>
        <div className="mt-8"><TradeForm mode="edit" trade={serializeTrade(trade)} /></div>
      </div>
    </AppShell>
  );
}
