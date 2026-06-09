import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildTradeOrderBy, buildTradeWhere } from "@/lib/trades/query";
import { tradeQuerySchema } from "@/lib/validation/trade";

export default async function TradesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const params = await searchParams;
  const flatParams = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const query = tradeQuerySchema.parse(flatParams);
  const trades = await prisma.trade.findMany({
    where: buildTradeWhere(user.id, query),
    orderBy: buildTradeOrderBy(query.sort),
    take: 100,
  });

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

      <form className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-6">
        <input name="search" defaultValue={query.search ?? ""} placeholder="Search pair/setup" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white md:col-span-2" />
        <select name="result" defaultValue={query.result ?? ""} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"><option value="">All result</option><option value="win">Win</option><option value="loss">Loss</option><option value="breakeven">Breakeven</option><option value="open">Open</option></select>
        <select name="direction" defaultValue={query.direction ?? ""} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"><option value="">All direction</option><option value="buy">Buy</option><option value="sell">Sell</option></select>
        <select name="timeframe" defaultValue={query.timeframe ?? ""} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"><option value="">All TF</option>{["M1","M5","M15","M30","H1","H4","D1","W1"].map((tf) => <option key={tf} value={tf}>{tf}</option>)}</select>
        <select name="sort" defaultValue={query.sort} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest-profit">Highest profit</option><option value="biggest-loss">Biggest loss</option></select>
        <button className="rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 md:col-span-6">Apply filters</button>
      </form>

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
              <span className="flex gap-2"><Link href={`/trades/${trade.id}`} className="text-gold">View</Link><Link href={`/trades/${trade.id}/edit`} className="text-slate-300">Edit</Link></span>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
