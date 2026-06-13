import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PremiumDateInput } from "@/components/ui/premium-date-input";
import { PremiumSelect } from "@/components/ui/premium-select";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildTradeOrderBy, buildTradePagination, buildTradeWhere } from "@/lib/trades/query";
import { tradeQuerySchema } from "@/lib/validation/trade";

export default async function TradesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const params = await searchParams;
  const flatParams = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const query = tradeQuerySchema.parse(flatParams);
  const where = buildTradeWhere(user.id, query);
  const pagination = buildTradePagination(query.page);
  const [trades, totalTrades] = await Promise.all([
    prisma.trade.findMany({
      where,
      orderBy: buildTradeOrderBy(query.sort),
      take: pagination.take,
      skip: pagination.skip,
    }),
    prisma.trade.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalTrades / pagination.take));
  const pageNetPnL = trades.reduce((sum, trade) => sum + (trade.profitLossAmount?.toNumber() ?? 0), 0);
  const pageWins = trades.filter((trade) => trade.result === "win").length;
  const openTrades = trades.filter((trade) => trade.status === "open").length;
  const pageNetTone = pageNetPnL > 0 ? "text-emerald-300" : pageNetPnL < 0 ? "text-rose-300" : "text-white";
  const makePageHref = (page: number) => {
    const nextParams = new URLSearchParams();
    for (const [key, value] of Object.entries(flatParams)) {
      if (value && key !== "page") nextParams.set(key, value);
    }
    nextParams.set("page", String(page));
    return `/trades?${nextParams.toString()}`;
  };

  return (
    <AppShell>
      <section data-testid="trade-history-command-center" className="premium-card animate-fade-up relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(244,213,141,0.18),transparent_30%),radial-gradient(circle_at_90%_12%,rgba(45,212,191,0.10),transparent_28%)]" />
        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <p className="inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-goldLight">Trade History</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Your trades</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Search, filter, sort, edit, delete, dan review semua trade dalam layout card yang lebih enak dibaca di desktop maupun mobile.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row xl:items-center">
            <Link href="/trades/new" className="premium-button rounded-full bg-gold px-5 py-3 text-center font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
          </div>
        </div>
        <div data-testid="trade-history-stats-strip" className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"><p className="text-xs text-slate-400">Filtered trades</p><p className="mt-1 text-2xl font-semibold tabular-nums">{totalTrades}</p></div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"><p className="text-xs text-slate-400">Page wins</p><p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-300">{pageWins}</p></div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"><p className="text-xs text-slate-400">Page net P/L</p><p className={`mt-1 text-2xl font-semibold tabular-nums ${pageNetTone}`}>{pageNetPnL}</p></div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"><p className="text-xs text-slate-400">Open risk</p><p className="mt-1 text-2xl font-semibold tabular-nums text-goldLight">{openTrades}</p></div>
        </div>
      </section>

      <form data-testid="trade-filter-panel" className="dropdown-layer premium-card interactive-card animate-fade-up mt-8 grid gap-3 rounded-3xl p-4 md:grid-cols-6" aria-label="Trade filters">
        <label className="text-sm text-slate-300 md:col-span-2">Search
          <input name="search" defaultValue={query.search ?? ""} placeholder="Search pair/setup" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/40" />
        </label>
        <label className="text-sm text-slate-300">Result
          <PremiumSelect name="result" defaultValue={query.result ?? ""} options={[{ value: "", label: "All result" }, { value: "win", label: "Win" }, { value: "loss", label: "Loss" }, { value: "breakeven", label: "Breakeven" }, { value: "open", label: "Open" }]} />
        </label>
        <label className="text-sm text-slate-300">Direction
          <PremiumSelect name="direction" defaultValue={query.direction ?? ""} options={[{ value: "", label: "All direction" }, { value: "buy", label: "Buy" }, { value: "sell", label: "Sell" }]} />
        </label>
        <label className="text-sm text-slate-300">Timeframe
          <PremiumSelect name="timeframe" defaultValue={query.timeframe ?? ""} options={[{ value: "", label: "All TF" }, ...["M1","M5","M15","M30","H1","H4","D1","W1"].map((tf) => ({ value: tf, label: tf }))]} />
        </label>
        <label className="text-sm text-slate-300">Sort
          <PremiumSelect name="sort" defaultValue={query.sort} options={[{ value: "newest", label: "Newest" }, { value: "oldest", label: "Oldest" }, { value: "highest-profit", label: "Highest profit" }, { value: "biggest-loss", label: "Biggest loss" }]} />
        </label>
        <label className="text-sm text-slate-300 md:col-span-2">Date from
          <PremiumDateInput ariaLabel="Filter date from" name="dateFrom" defaultValue={query.dateFrom ?? ""} />
        </label>
        <label className="text-sm text-slate-300 md:col-span-2">Date to
          <PremiumDateInput ariaLabel="Filter date to" name="dateTo" defaultValue={query.dateTo ?? ""} />
        </label>
        <button className="premium-button rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 md:col-span-2 md:self-end">Apply filters</button>
      </form>

      <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Showing {trades.length} of {totalTrades} trades · Page {pagination.page} / {totalPages}</p>
        {totalTrades > 0 && <p>Limit {pagination.take} trades per page</p>}
      </div>

      {trades.length === 0 ? (
        <div data-testid="trade-history-empty-state" className="premium-card animate-fade-up mt-8 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-semibold">Belum ada trade</h2>
          <p className="mt-3 text-slate-400">Mulai catat trade pertama kamu agar dashboard dan analytics bisa membaca performa.</p>
          <Link href="/trades/new" className="premium-button mt-6 inline-flex rounded-full bg-gold px-5 py-3 font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
        </div>
      ) : (
        <div data-testid="trade-history-table" className="premium-card relative z-0 animate-fade-up mt-8 overflow-hidden rounded-3xl p-1">
          <div data-testid="trade-history-card-grid" className="grid gap-4 lg:grid-cols-2">
            {trades.map((trade) => {
              const pnl = trade.profitLossAmount?.toNumber() ?? null;
              const pnlTone = pnl === null ? "border-white/10 bg-white/[0.05] text-slate-300" : pnl > 0 ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : pnl < 0 ? "border-rose-400/20 bg-rose-400/10 text-rose-300" : "border-white/10 bg-white/[0.05] text-slate-200";
              const resultTone = trade.result === "win" ? "bg-emerald-400/10 text-emerald-300" : trade.result === "loss" ? "bg-rose-400/10 text-rose-300" : "bg-white/10 text-slate-300";
              return (
                <article key={trade.id} data-testid="trade-history-card" className="premium-card interactive-card animate-fade-up rounded-3xl p-5" aria-label={`${trade.pair} trade on ${trade.openDate.toISOString().slice(0, 10)}`}>
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>{trade.openDate.toISOString().slice(0, 10)}</span>
                        <span>•</span>
                        <span>{trade.timeframe ?? "No TF"}</span>
                        <span className={`rounded-full px-2.5 py-1 capitalize ${resultTone}`}>{trade.result}</span>
                      </div>
                      <h2 className="mt-3 text-2xl font-semibold text-white">{trade.pair}</h2>
                      <p className="mt-1 text-sm capitalize text-slate-400">{trade.direction} · {trade.status}</p>
                    </div>
                    <span data-testid="trade-history-pnl-badge" className={`rounded-2xl border px-4 py-3 text-right font-semibold tabular-nums ${pnlTone}`}>{pnl ?? "—"}<span className="block text-[10px] uppercase tracking-widest opacity-70">P/L</span></span>
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div className="rounded-2xl bg-white/[0.04] p-3"><dt className="text-slate-500">Setup</dt><dd className="mt-1 truncate text-slate-200">{trade.setupName ?? "—"}</dd></div>
                    <div className="rounded-2xl bg-white/[0.04] p-3"><dt className="text-slate-500">Session</dt><dd className="mt-1 text-slate-200">{trade.session ?? "—"}</dd></div>
                    <div className="rounded-2xl bg-white/[0.04] p-3"><dt className="text-slate-500">R:R</dt><dd className="mt-1 text-slate-200 tabular-nums">{trade.riskRewardRatio?.toString() ?? "—"}</dd></div>
                    <div className="rounded-2xl bg-white/[0.04] p-3"><dt className="text-slate-500">Close date</dt><dd className="mt-1 text-slate-200">{trade.closeDate?.toISOString().slice(0, 10) ?? "Open"}</dd></div>
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm">
                    <Link href={`/trades/${trade.id}`} className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 font-semibold text-goldLight transition hover:border-gold/50" aria-label={`View ${trade.pair} trade`}>View detail</Link>
                    <Link href={`/trades/${trade.id}/edit`} className="rounded-full border border-white/10 px-4 py-2 font-semibold text-slate-300 transition hover:border-white/25 hover:text-white" aria-label={`Edit ${trade.pair} trade`}>Edit</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Trade history pagination" className="mt-6 flex items-center justify-between gap-3">
          {pagination.page > 1 ? <Link href={makePageHref(pagination.page - 1)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-gold/50">← Previous</Link> : <span className="rounded-full border border-white/5 px-4 py-2 text-sm text-slate-600">← Previous</span>}
          <span className="text-sm text-slate-400">Page {pagination.page} of {totalPages}</span>
          {pagination.page < totalPages ? <Link href={makePageHref(pagination.page + 1)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-gold/50">Next →</Link> : <span className="rounded-full border border-white/5 px-4 py-2 text-sm text-slate-600">Next →</span>}
        </nav>
      )}
    </AppShell>
  );
}
