import Link from "next/link";
import { AppShell } from "@/components/app-shell";
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
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-gold">Trade History</p>
          <h1 className="mt-2 text-4xl font-semibold">Your trades</h1>
          <p className="mt-2 text-slate-400">Search, filter, sort, edit, delete, dan review semua trade milik kamu.</p>
        </div>
        <Link href="/trades/new" className="rounded-full bg-gold px-5 py-3 text-center font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
      </div>

      <form className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-6" aria-label="Trade filters">
        <label className="text-sm text-slate-300 md:col-span-2">Search
          <input name="search" defaultValue={query.search ?? ""} placeholder="Search pair/setup" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
        </label>
        <label className="text-sm text-slate-300">Result
          <select name="result" defaultValue={query.result ?? ""} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"><option value="">All result</option><option value="win">Win</option><option value="loss">Loss</option><option value="breakeven">Breakeven</option><option value="open">Open</option></select>
        </label>
        <label className="text-sm text-slate-300">Direction
          <select name="direction" defaultValue={query.direction ?? ""} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"><option value="">All direction</option><option value="buy">Buy</option><option value="sell">Sell</option></select>
        </label>
        <label className="text-sm text-slate-300">Timeframe
          <select name="timeframe" defaultValue={query.timeframe ?? ""} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"><option value="">All TF</option>{["M1","M5","M15","M30","H1","H4","D1","W1"].map((tf) => <option key={tf} value={tf}>{tf}</option>)}</select>
        </label>
        <label className="text-sm text-slate-300">Sort
          <select name="sort" defaultValue={query.sort} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest-profit">Highest profit</option><option value="biggest-loss">Biggest loss</option></select>
        </label>
        <label className="text-sm text-slate-300 md:col-span-2">Date from
          <input aria-label="Filter date from" name="dateFrom" type="date" defaultValue={query.dateFrom ?? ""} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
        </label>
        <label className="text-sm text-slate-300 md:col-span-2">Date to
          <input aria-label="Filter date to" name="dateTo" type="date" defaultValue={query.dateTo ?? ""} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
        </label>
        <button className="rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 md:col-span-2 md:self-end">Apply filters</button>
      </form>

      <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Showing {trades.length} of {totalTrades} trades · Page {pagination.page} / {totalPages}</p>
        {totalTrades > 0 && <p>Limit {pagination.take} trades per page</p>}
      </div>

      {trades.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <h2 className="text-2xl font-semibold">Belum ada trade</h2>
          <p className="mt-3 text-slate-400">Mulai catat trade pertama kamu agar dashboard dan analytics bisa membaca performa.</p>
          <Link href="/trades/new" className="mt-6 inline-flex rounded-full bg-gold px-5 py-3 font-semibold text-slate-950">Add Trade</Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="hidden grid-cols-9 border-b border-white/10 px-5 py-3 text-sm text-slate-400 md:grid">
            <span>Date</span><span>Pair</span><span>Direction</span><span>Setup</span><span>TF</span><span>Result</span><span>P/L</span><span>R:R</span><span>Actions</span>
          </div>
          <div className="md:hidden">
            {trades.map((trade) => (
              <article key={trade.id} className="border-b border-white/5 p-5 last:border-0" aria-label={`${trade.pair} trade on ${trade.openDate.toISOString().slice(0, 10)}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400">{trade.openDate.toISOString().slice(0, 10)} · {trade.timeframe ?? "No TF"}</p>
                    <h2 className="mt-1 text-lg font-semibold">{trade.pair}</h2>
                  </div>
                  <span className={trade.result === "win" ? "rounded-full bg-emerald-400/10 px-3 py-1 text-sm capitalize text-emerald-300" : trade.result === "loss" ? "rounded-full bg-rose-400/10 px-3 py-1 text-sm capitalize text-rose-300" : "rounded-full bg-white/10 px-3 py-1 text-sm capitalize text-slate-300"}>{trade.result}</span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-slate-500">Direction</dt><dd className="mt-1 capitalize text-slate-200">{trade.direction}</dd></div>
                  <div><dt className="text-slate-500">P/L</dt><dd className="mt-1 text-slate-200">{trade.profitLossAmount?.toString() ?? "—"}</dd></div>
                  <div><dt className="text-slate-500">Setup</dt><dd className="mt-1 text-slate-200">{trade.setupName ?? "—"}</dd></div>
                  <div><dt className="text-slate-500">R:R</dt><dd className="mt-1 text-slate-200">{trade.riskRewardRatio?.toString() ?? "—"}</dd></div>
                </dl>
                <div className="mt-4 flex gap-3 text-sm"><Link href={`/trades/${trade.id}`} className="text-gold" aria-label={`View ${trade.pair} trade`}>View</Link><Link href={`/trades/${trade.id}/edit`} className="text-slate-300" aria-label={`Edit ${trade.pair} trade`}>Edit</Link></div>
              </article>
            ))}
          </div>
          <div className="hidden md:block">
            {trades.map((trade) => (
              <div key={trade.id} className="grid gap-3 border-b border-white/5 px-5 py-4 text-sm last:border-0 md:grid-cols-9 md:items-center">
                <span>{trade.openDate.toISOString().slice(0, 10)}</span>
                <span className="font-semibold">{trade.pair}</span>
                <span className="capitalize">{trade.direction}</span>
                <span>{trade.setupName ?? "—"}</span>
                <span>{trade.timeframe ?? "—"}</span>
                <span className={trade.result === "win" ? "text-emerald-300" : trade.result === "loss" ? "text-rose-300" : "text-slate-300"}>{trade.result}</span>
                <span>{trade.profitLossAmount?.toString() ?? "—"}</span>
                <span>{trade.riskRewardRatio?.toString() ?? "—"}</span>
                <span className="flex gap-2"><Link href={`/trades/${trade.id}`} className="text-gold" aria-label={`View ${trade.pair} trade`}>View</Link><Link href={`/trades/${trade.id}/edit`} className="text-slate-300" aria-label={`Edit ${trade.pair} trade`}>Edit</Link></span>
              </div>
            ))}
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
