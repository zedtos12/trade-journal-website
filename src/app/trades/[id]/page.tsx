import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DeleteTradeButton } from "@/components/delete-trade-button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeTrade } from "@/lib/trades/serialize";

type PageProps = { params: Promise<{ id: string }> };

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="interactive-card rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-slate-100">{value === null || typeof value === "undefined" || value === "" ? "—" : value}</p>
    </div>
  );
}

export default async function TradeDetailPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const tradeRecord = await prisma.trade.findFirst({ where: { id, userId: user.id } });
  if (!tradeRecord) notFound();
  const trade = serializeTrade(tradeRecord);
  const pnlClass = (trade.profitLossAmount ?? 0) >= 0 ? "text-emerald-300" : "text-rose-300";

  return (
    <AppShell>
      <Link href="/trades" className="text-sm text-slate-400 transition hover:text-white">← Back to history</Link>
      <div data-testid="trade-detail-hero" className="premium-card interactive-card animate-fade-up mt-6 flex flex-col justify-between gap-4 rounded-3xl p-6 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">{trade.pair}</h1>
            <span className="rounded-full border border-white/10 px-3 py-1 text-sm capitalize text-slate-300">{trade.result}</span>
          </div>
          <p className={`mt-4 text-3xl font-semibold ${pnlClass}`}>{trade.profitLossAmount ?? "—"}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/trades/${trade.id}/edit`} className="premium-button rounded-full bg-gold px-4 py-2 font-semibold text-slate-950 hover:bg-goldLight">Edit</Link>
          <DeleteTradeButton id={trade.id} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section data-testid="trade-detail-section" className="premium-card interactive-card animate-fade-up rounded-3xl p-6">
          <h2 className="text-xl font-semibold tracking-tight">Trade metadata</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Field label="Direction" value={trade.direction} /><Field label="Status" value={trade.status} /><Field label="Open date" value={trade.openDate.slice(0,10)} /><Field label="Close date" value={trade.closeDate?.slice(0,10)} /><Field label="Setup" value={trade.setupName} /><Field label="Timeframe" value={trade.timeframe} /><Field label="Session" value={trade.session} />
          </div>
        </section>
        <section data-testid="trade-detail-section" className="premium-card interactive-card animate-fade-up rounded-3xl p-6">
          <h2 className="text-xl font-semibold tracking-tight">Risk management</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Field label="Entry" value={trade.entryPrice} /><Field label="Exit" value={trade.exitPrice} /><Field label="Lot" value={trade.lotSize} /><Field label="Stop loss" value={trade.stopLoss} /><Field label="Take profit" value={trade.takeProfit} /><Field label="R:R" value={trade.riskRewardRatio} /><Field label="P/L %" value={trade.profitLossPercentage} />
          </div>
        </section>
      </div>

      <section data-testid="trade-detail-section" className="premium-card interactive-card animate-fade-up mt-6 rounded-3xl p-6">
        <h2 className="text-xl font-semibold tracking-tight">Psychology & Review</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Field label="Emotion before" value={trade.emotionBefore} /><Field label="Emotion after" value={trade.emotionAfter} />
        </div>
        <div className="mt-3 grid gap-3">
          <Field label="Entry reason" value={trade.entryReason} /><Field label="Exit reason" value={trade.exitReason} /><Field label="Lesson learned" value={trade.lessonLearned} /><Field label="Notes" value={trade.notes} />
        </div>
      </section>
    </AppShell>
  );
}
