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
  const pageNetBorder = pageNetPnL > 0 ? "border-emerald-500/30" : pageNetPnL < 0 ? "border-rose-500/30" : "border-white/10";
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
      {/* ── Command Center Hero ── */}
      <section data-testid="trade-history-command-center" className="premium-card animate-fade-up relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(244,213,141,0.18),transparent_30%),radial-gradient(circle_at_90%_12%,rgba(45,212,191,0.10),transparent_28%)]" />
        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <p className="inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-goldLight">Trade History</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Your trades</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Search, filter, sort, edit, delete, dan review semua trade dalam layout card yang lebih enak dibaca di desktop maupun mobile.</p>
          </div>
          <Link href="/trades/new" className="premium-button rounded-full bg-gold px-5 py-3 text-center font-semibold text-slate-950 hover:bg-goldLight">
            Add Trade
          </Link>
        </div>

        {/* ── Stats Strip ── */}
        <div data-testid="trade-history-stats-strip" className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-slate-950/55 p-4 transition hover:border-white/20">
            <p className="text-xs text-slate-400">Filtered trades</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{totalTrades}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-400/5 p-4 transition hover:border-emerald-500/35">
            <p className="text-xs text-slate-400">Page wins</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-300">{pageWins}</p>
          </div>
          <div className={`rounded-xl border ${pageNetBorder} bg-slate-950/55 p-4 transition hover:border-opacity-60`}>
            <p className="text-xs text-slate-400">Page net P/L</p>
            <p className={`mt-1 text-2xl font-semibold tabular-nums ${pageNetTone}`}>{pageNetPnL.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 transition hover:border-gold/35">
            <p className="text-xs text-slate-400">Open risk</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-goldLight">{openTrades}</p>
          </div>
        </div>
      </section>

      {/* ── Filter Panel ── */}
      <form data-testid="trade-filter-panel" className="dropdown-layer premium-card interactive-card animate-fade-up mt-8 rounded-3xl p-5" aria-label="Trade filters" style={{ animationDelay: "60ms" }}>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-goldLight">Filter & Sort</p>
        <div className="grid gap-3 md:grid-cols-6">
          <label className="text-sm text-slate-300 md:col-span-2">
            Search
            <input name="search" defaultValue={query.search ?? ""} placeholder="Search pair / setup…" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/20" />
          </label>
          <label className="text-sm text-slate-300">
            Result
            <PremiumSelect name="result" defaultValue={query.result ?? ""} options={[{ value: "", label: "All results" }, { value: "win", label: "Win" }, { value: "loss", label: "Loss" }, { value: "breakeven", label: "Breakeven" }, { value: "open", label: "Open" }]} />
          </label>
          <label className="text-sm text-slate-300">
            Direction
            <PremiumSelect name="direction" defaultValue={query.direction ?? ""} options={[{ value: "", label: "All directions" }, { value: "buy", label: "Buy" }, { value: "sell", label: "Sell" }]} />
          </label>
          <label className="text-sm text-slate-300">
            Timeframe
            <PremiumSelect name="timeframe" defaultValue={query.timeframe ?? ""} options={[{ value: "", label: "All TF" }, ...["M1","M5","M15","M30","H1","H4","D1","W1"].map((tf) => ({ value: tf, label: tf }))]} />
          </label>
          <label className="text-sm text-slate-300">
            Sort by
            <PremiumSelect name="sort" defaultValue={query.sort} options={[{ value: "newest", label: "Newest" }, { value: "oldest", label: "Oldest" }, { value: "highest-profit", label: "Highest profit" }, { value: "biggest-loss", label: "Biggest loss" }]} />
          </label>
          <label className="text-sm text-slate-300 md:col-span-2">
            Date from
            <PremiumDateInput ariaLabel="Filter date from" name="dateFrom" defaultValue={query.dateFrom ?? ""} />
          </label>
          <label className="text-sm text-slate-300 md:col-span-2">
            Date to
            <PremiumDateInput ariaLabel="Filter date to" name="dateTo" defaultValue={query.dateTo ?? ""} />
          </label>
          <div className="flex items-end md:col-span-2">
            <button type="submit" className="premium-button w-full rounded-xl bg-gold px-4 py-3 font-semibold text-slate-950 hover:bg-goldLight">
              Apply filters
            </button>
          </div>
        </div>
      </form>

      {/* ── Pagination meta ── */}
      <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Showing <span className="font-semibold tabular-nums text-slate-300">{trades.length}</span> of <span className="font-semibold tabular-nums text-slate-300">{totalTrades}</span> trades · Page {pagination.page} / {totalPages}</p>
        {totalTrades > 0 && <p>{pagination.take} trades per page</p>}
      </div>

      {/* ── Empty / Card Grid ── */}
      {trades.length === 0 ? (
        <div data-testid="trade-history-empty-state" className="premium-card animate-fade-up mt-8 rounded-3xl p-12 text-center" style={{ animationDelay: "80ms" }}>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-goldLight" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Belum ada trade</h2>
          <p className="mx-auto mt-3 max-w-md text-slate-400">Mulai catat trade pertama kamu agar dashboard dan analytics bisa membaca performa kamu secara menyeluruh.</p>
          <Link href="/trades/new" className="premium-button mt-6 inline-flex rounded-full bg-gold px-6 py-3 font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
        </div>
      ) : (
        <div data-testid="trade-history-table" className="premium-card relative z-0 animate-fade-up mt-8 overflow-hidden rounded-3xl p-1" style={{ animationDelay: "80ms" }}>
          <div data-testid="trade-history-card-grid" className="grid gap-4 lg:grid-cols-2">
            {trades.map((trade, idx) => {
              const pnl = trade.profitLossAmount?.toNumber() ?? null;
              const pnlBadge = pnl === null
                ? "border-white/10 bg-white/[0.05] text-slate-300"
                : pnl > 0
                  ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                  : pnl < 0
                    ? "border-rose-400/25 bg-rose-400/10 text-rose-300"
                    : "border-white/10 bg-white/[0.05] text-slate-200";
              const resultBadge = trade.result === "win"
                ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                : trade.result === "loss"
                  ? "bg-rose-400/10 text-rose-300 border border-rose-400/20"
                  : "bg-white/10 text-slate-300 border border-white/10";
              const directionIcon = trade.direction === "buy"
                ? <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-emerald-400" aria-hidden="true"><path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04L10.75 5.612V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" /></svg>
                : <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-rose-400" aria-hidden="true"><path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" /></svg>;
              return (
                <article
                  key={trade.id}
                  data-testid="trade-history-card"
                  className="premium-card interactive-card animate-fade-up group rounded-3xl p-5"
                  aria-label={`${trade.pair} trade on ${trade.openDate.toISOString().slice(0, 10)}`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* ── Card Header ── */}
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="tabular-nums">{trade.openDate.toISOString().slice(0, 10)}</span>
                        <span className="text-slate-600">·</span>
                        <span>{trade.timeframe ?? "No TF"}</span>
                        <span className={`rounded-full px-2.5 py-1 capitalize ${resultBadge}`}>{trade.result}</span>
                      </div>
                      <h2 className="mt-3 text-2xl font-semibold text-white">{trade.pair}</h2>
                      <div className="mt-1 flex items-center gap-1.5 text-sm capitalize text-slate-400">
                        {directionIcon}
                        <span>{trade.direction} · {trade.status}</span>
                      </div>
                    </div>
                    <span data-testid="trade-history-pnl-badge" className={`shrink-0 rounded-xl border px-4 py-3 text-right font-semibold tabular-nums ${pnlBadge}`}>
                      {pnl !== null ? (pnl >= 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2)) : "—"}
                      <span className="block text-[10px] uppercase tracking-widest opacity-60">P/L</span>
                    </span>
                  </div>

                  {/* ── Card Details ── */}
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <dt className="text-xs text-slate-500">Setup</dt>
                      <dd className="mt-1 truncate font-medium text-slate-200">{trade.setupName ?? "—"}</dd>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <dt className="text-xs text-slate-500">Session</dt>
                      <dd className="mt-1 font-medium text-slate-200">{trade.session ?? "—"}</dd>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <dt className="text-xs text-slate-500">R:R</dt>
                      <dd className="mt-1 font-medium tabular-nums text-slate-200">{trade.riskRewardRatio?.toString() ?? "—"}</dd>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <dt className="text-xs text-slate-500">Close date</dt>
                      <dd className="mt-1 font-medium text-slate-200">{trade.closeDate?.toISOString().slice(0, 10) ?? <span className="text-goldLight">Open</span>}</dd>
                    </div>
                  </dl>

                  {/* ── Actions ── */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2 text-sm">
                      <Link href={`/trades/${trade.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-4 py-2 font-semibold text-goldLight transition hover:border-gold/50 hover:bg-gold/15" aria-label={`View ${trade.pair} trade`}>
                        View detail
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <Link href={`/trades/${trade.id}/edit`} className="rounded-full border border-white/10 px-4 py-2 font-semibold text-slate-300 transition hover:border-white/25 hover:text-white" aria-label={`Edit ${trade.pair} trade`}>Edit</Link>
                    </div>
                    {trade.notes && (
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500" title={trade.notes}>Has notes</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <nav aria-label="Trade history pagination" className="mt-6 flex items-center justify-between gap-3">
          {pagination.page > 1 ? (
            <Link href={makePageHref(pagination.page - 1)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-gold/40 hover:text-white">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H6.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L6.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" /></svg>
              Previous
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/5 px-4 py-2 text-sm text-slate-600">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H6.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L6.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" /></svg>
              Previous
            </span>
          )}
          <span className="text-sm tabular-nums text-slate-400">Page {pagination.page} of {totalPages}</span>
          {pagination.page < totalPages ? (
            <Link href={makePageHref(pagination.page + 1)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-gold/40 hover:text-white">
              Next
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/5 px-4 py-2 text-sm text-slate-600">
              Next
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
            </span>
          )}
        </nav>
      )}
    </AppShell>
  );
}
