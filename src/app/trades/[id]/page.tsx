import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DeleteTradeButton } from "@/components/delete-trade-button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeTrade } from "@/lib/trades/serialize";

type PageProps = { params: Promise<{ id: string }> };

function Field({ label, value, tone = "neutral" }: { label: string; value?: string | number | null; tone?: "neutral" | "profit" | "loss" | "gold" }) {
  const toneClass = tone === "profit" ? "border-emerald-500/20 bg-emerald-500/5" : tone === "loss" ? "border-rose-500/20 bg-rose-500/5" : tone === "gold" ? "border-gold/20 bg-gold/[0.04]" : "border-white/10 bg-slate-950/50";
  return (
    <div className={`interactive-card rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:border-gold/30 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 font-medium text-slate-100">{value === null || typeof value === "undefined" || value === "" ? "—" : value}</p>
    </div>
  );
}

function DirectionIcon({ direction }: { direction: string }) {
  if (direction === "buy") {
    return (
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true"><path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04L10.75 5.612V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" /></svg>
      </span>
    );
  }
  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-300">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true"><path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" /></svg>
    </span>
  );
}

export default async function TradeDetailPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const tradeRecord = await prisma.trade.findFirst({ where: { id, userId: user.id } });
  if (!tradeRecord) notFound();
  const trade = serializeTrade(tradeRecord);
  const pnl = trade.profitLossAmount ?? null;
  const pnlClass = (pnl ?? 0) >= 0 ? "text-emerald-300" : "text-rose-300";
  const pnlGlow = (pnl ?? 0) >= 0 ? "from-emerald-500/12" : "from-rose-500/12";
  const resultPill = trade.result === "win" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : trade.result === "loss" ? "border-rose-400/20 bg-rose-400/10 text-rose-300" : "border-white/10 bg-white/10 text-slate-300";

  return (
    <AppShell>
      <Link href="/trades" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition hover:border-gold/35 hover:text-white">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H6.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L6.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" /></svg>
        Back to history
      </Link>

      <div data-testid="trade-detail-hero" className={`premium-card interactive-card animate-fade-up relative mt-6 overflow-hidden rounded-3xl p-6 md:p-8`}>
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pnlGlow} via-transparent to-gold/8`} />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="flex items-start gap-4">
            <DirectionIcon direction={trade.direction} />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-tight text-white">{trade.pair}</h1>
                <span className={`rounded-full border px-3 py-1 text-sm capitalize ${resultPill}`}>{trade.result}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm capitalize text-slate-300">{trade.direction} · {trade.status}</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">Opened {trade.openDate.slice(0,10)}{trade.closeDate ? ` · Closed ${trade.closeDate.slice(0,10)}` : " · Still open"}</p>
              <p className={`mt-5 text-4xl font-semibold tabular-nums ${pnlClass}`}>{pnl === null ? "—" : pnl >= 0 ? `+${pnl}` : pnl}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Profit / Loss</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/trades/${trade.id}/edit`} className="premium-button rounded-full bg-gold px-5 py-2.5 font-semibold text-slate-950 hover:bg-goldLight">Edit</Link>
            <DeleteTradeButton id={trade.id} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section data-testid="trade-detail-section" className="premium-card interactive-card animate-fade-up rounded-3xl p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Trade metadata</h2>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">Execution context</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Field label="Direction" value={trade.direction} tone={trade.direction === "buy" ? "profit" : "loss"} />
            <Field label="Status" value={trade.status} tone={trade.status === "open" ? "gold" : "neutral"} />
            <Field label="Open date" value={trade.openDate.slice(0,10)} />
            <Field label="Close date" value={trade.closeDate?.slice(0,10)} />
            <Field label="Setup" value={trade.setupName} />
            <Field label="Timeframe" value={trade.timeframe} />
            <Field label="Session" value={trade.session} tone="gold" />
          </div>
        </section>

        <section data-testid="trade-detail-section" className="premium-card interactive-card animate-fade-up rounded-3xl p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Risk management</h2>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">Position math</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Field label="Entry" value={trade.entryPrice} />
            <Field label="Exit" value={trade.exitPrice} />
            <Field label="Lot" value={trade.lotSize} />
            <Field label="Stop loss" value={trade.stopLoss} tone="loss" />
            <Field label="Take profit" value={trade.takeProfit} tone="profit" />
            <Field label="R:R" value={trade.riskRewardRatio} tone="gold" />
            <Field label="P/L %" value={trade.profitLossPercentage} tone={(trade.profitLossPercentage ?? 0) >= 0 ? "profit" : "loss"} />
          </div>
        </section>
      </div>

      <section data-testid="trade-detail-section" className="premium-card interactive-card animate-fade-up mt-6 rounded-3xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Psychology & Review</h2>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">Journal notes</span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Field label="Emotion before" value={trade.emotionBefore} />
          <Field label="Emotion after" value={trade.emotionAfter} />
        </div>
        <div className="mt-3 grid gap-3">
          <Field label="Entry reason" value={trade.entryReason} />
          <Field label="Exit reason" value={trade.exitReason} />
          <Field label="Lesson learned" value={trade.lessonLearned} tone="gold" />
          <Field label="Notes" value={trade.notes} />
        </div>
      </section>
    </AppShell>
  );
}
