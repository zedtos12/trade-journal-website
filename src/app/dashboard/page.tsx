import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { calculateDashboardMetrics } from "@/lib/analytics/metrics";
import { buildEquityCurve, buildMonthlyPerformance, summarizePerformanceByKey } from "@/lib/analytics/dashboard-insights";
import { prisma } from "@/lib/db";

function MetricCard({ label, value, tone = "neutral", delay = 0 }: { label: string; value: string | number; tone?: "neutral" | "profit" | "loss"; delay?: number }) {
  const toneClass = tone === "profit" ? "text-emerald-300" : tone === "loss" ? "text-rose-300" : "text-white";
  const accentClass = tone === "profit" ? "from-emerald-400/20" : tone === "loss" ? "from-rose-400/20" : "from-gold/15";
  return (
    <div data-testid="dashboard-metric-card" className={`premium-card interactive-card animate-fade-up relative overflow-hidden rounded-3xl p-5 ${accentClass}`} style={{ animationDelay: `${delay}ms` }}>
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${accentClass} to-transparent`} />
      <p className="relative text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function InsightCard({ title, row }: { title: string; row: { label: string; totalPnL: number; trades: number } | null }) {
  return (
    <div className="premium-card interactive-card animate-fade-up rounded-3xl p-5">
      <p className="text-sm text-slate-400">{title}</p>
      {row ? (
        <div className="mt-3">
          <p className="text-xl font-semibold">{row.label}</p>
          <p className={row.totalPnL >= 0 ? "mt-1 text-emerald-300" : "mt-1 text-rose-300"}>{row.totalPnL} P/L • {row.trades} trades</p>
        </div>
      ) : (
        <p className="mt-3 text-slate-500">Not enough data</p>
      )}
    </div>
  );
}

function EquityCurve({ points }: { points: { label: string; value: number }[] }) {
  if (points.length === 0) {
    return <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-gold/20 bg-slate-950/40 text-slate-500">Belum ada data equity curve</div>;
  }

  const width = 720;
  const height = 240;
  const paddingX = 36;
  const paddingY = 30;
  const min = Math.min(...points.map((point) => point.value), 0);
  const max = Math.max(...points.map((point) => point.value), 1);
  const range = max - min || 1;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  const coordinates = points.map((point, index) => {
    const x = points.length === 1 ? width / 2 : paddingX + (index / (points.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((point.value - min) / range) * chartHeight;
    return { ...point, x, y };
  });
  const linePoints = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = `${paddingX},${height - paddingY} ${linePoints} ${width - paddingX},${height - paddingY}`;

  return (
    <div data-testid="dashboard-equity-chart" className="relative h-64 overflow-hidden rounded-2xl border border-gold/15 bg-slate-950/70 p-3 shadow-inner shadow-black/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(217,180,94,0.16),transparent_32%),linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:100%_100%,64px_64px,64px_64px]" />
      <svg viewBox={`0 0 ${width} ${height}`} className="relative h-full w-full" role="img" aria-label="Visible equity curve line chart">
        <polygon points={areaPoints} className="fill-gold/15" />
        <polyline points={linePoints} className="fill-none stroke-goldLight" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {coordinates.map((point, index) => (
          <g key={`${point.label}-${index}`} className="group cursor-pointer">
            <circle cx={point.x} cy={point.y} r="10" className="fill-goldLight/20 opacity-0 transition group-hover:opacity-100" />
            <circle cx={point.x} cy={point.y} r="7" className="fill-goldLight stroke-slate-950 transition group-hover:scale-125" strokeWidth="3" />
            <foreignObject x={Math.max(8, Math.min(width - 128, point.x - 60))} y={Math.max(8, point.y - 60)} width="120" height="48" className="pointer-events-none opacity-0 transition duration-200 group-hover:opacity-100">
              <div data-testid="dashboard-equity-tooltip" className="rounded-xl border border-gold/30 bg-slate-950/95 px-3 py-2 text-center shadow-xl shadow-black/40">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">{point.label}</p>
                <p className="text-xs font-semibold text-goldLight">{point.value} P/L</p>
              </div>
            </foreignObject>
            <text x={point.x} y={height - 8} textAnchor="middle" className="fill-slate-400 text-[11px]">{point.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const allTrades = await prisma.trade.findMany({ where: { userId: user.id }, orderBy: { openDate: "desc" } });
  const recentTrades = allTrades.slice(0, 5);
  const metricTrades = allTrades.map((trade) => ({
    status: trade.status,
    result: trade.result,
    profitLossAmount: trade.profitLossAmount?.toNumber() ?? null,
    riskRewardRatio: trade.riskRewardRatio?.toNumber() ?? null,
  }));
  const insightTrades = allTrades.map((trade) => ({
    openDate: trade.openDate,
    pair: trade.pair,
    setupName: trade.setupName,
    profitLossAmount: trade.profitLossAmount?.toNumber() ?? null,
  }));

  const metrics = calculateDashboardMetrics(metricTrades);
  const equityCurve = buildEquityCurve(insightTrades);
  const pairSummary = summarizePerformanceByKey(insightTrades, "pair");
  const setupSummary = summarizePerformanceByKey(insightTrades, "setupName");
  const monthlyPerformance = buildMonthlyPerformance(insightTrades).slice(-4);
  const totalTone = metrics.totalPnL > 0 ? "profit" : metrics.totalPnL < 0 ? "loss" : "neutral";
  const closedTrades = metricTrades.filter((trade) => trade.status === "closed").length;
  const winRateWidth = Math.max(0, Math.min(100, metrics.winRate));

  return (
    <AppShell>
      <section data-testid="dashboard-command-center" className="premium-card animate-fade-up relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(244,213,141,0.20),transparent_32%),radial-gradient(circle_at_90%_12%,rgba(45,212,191,0.13),transparent_30%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-goldLight">Good to see you, {user.name}</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">Trading command center</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">Pantau performa, equity curve, pair terbaik, setup terkuat, dan trade terbaru dalam satu workspace premium yang fokus ke keputusan trading.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/trades/new" className="premium-button rounded-full bg-gold px-5 py-3 text-center font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
              <Link href="/trades" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center font-semibold text-slate-200 transition hover:border-gold/35 hover:bg-white/[0.08] hover:text-white">Review history</Link>
            </div>
          </div>

          <div data-testid="dashboard-kpi-strip" className="rounded-3xl border border-white/10 bg-slate-950/55 p-4 shadow-inner shadow-black/30">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/[0.04] p-3"><p className="text-xs text-slate-400">Trades</p><p className="mt-1 text-xl font-semibold tabular-nums">{metrics.totalTrades}</p></div>
              <div className="rounded-2xl bg-white/[0.04] p-3"><p className="text-xs text-slate-400">Closed</p><p className="mt-1 text-xl font-semibold tabular-nums">{closedTrades}</p></div>
              <div className="rounded-2xl bg-white/[0.04] p-3"><p className="text-xs text-slate-400">P/L</p><p className={totalTone === "profit" ? "mt-1 text-xl font-semibold tabular-nums text-emerald-300" : totalTone === "loss" ? "mt-1 text-xl font-semibold tabular-nums text-rose-300" : "mt-1 text-xl font-semibold tabular-nums text-white"}>{metrics.totalPnL}</p></div>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400"><span>Win rate</span><span className="font-semibold tabular-nums text-goldLight">{metrics.winRate}%</span></div>
              <div data-testid="dashboard-winrate-progress" aria-label={`Win rate ${metrics.winRate}%`} aria-valuetext={`Win rate ${metrics.winRate}%`} className="h-2.5 overflow-hidden rounded-full bg-white/10" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={winRateWidth}>
                <div className="h-full rounded-full bg-gradient-to-r from-gold to-emerald-300 shadow-[0_0_24px_rgba(244,213,141,0.26)]" style={{ width: `${winRateWidth}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Total trades" value={metrics.totalTrades} delay={0} />
        <MetricCard label="Win rate" value={`${metrics.winRate}%`} delay={60} />
        <MetricCard label="Total P/L" value={`${user.preferred_currency} ${metrics.totalPnL}`} tone={totalTone} delay={120} />
        <MetricCard label="Average win" value={metrics.averageWin} tone="profit" delay={180} />
        <MetricCard label="Average loss" value={metrics.averageLoss} tone="loss" delay={240} />
        <MetricCard label="Profit factor" value={metrics.profitFactor} delay={300} />
        <MetricCard label="Average R:R" value={metrics.averageRiskReward} delay={360} />
        <MetricCard label="Closed trades" value={closedTrades} delay={420} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <section data-testid="dashboard-equity-section" className="premium-card interactive-card animate-fade-up rounded-3xl p-6" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Equity curve</h2>
              <p className="mt-2 text-slate-400">Cumulative P/L berdasarkan urutan trade.</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">{equityCurve.length} points</span>
          </div>
          <div className="mt-6"><EquityCurve points={equityCurve} /></div>
        </section>

        <section className="premium-card interactive-card animate-fade-up rounded-3xl p-6" style={{ animationDelay: "180ms" }}>
          <h2 className="text-2xl font-semibold">Monthly summary</h2>
          <div className="mt-5 space-y-3">
            {monthlyPerformance.length === 0 ? <p className="text-slate-500">Not enough data</p> : monthlyPerformance.map((month) => (
              <div key={month.label} className="interactive-card flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div><p className="font-semibold">{month.label}</p><p className="text-sm text-slate-500">{month.trades} trades</p></div>
                <p className={month.totalPnL >= 0 ? "text-emerald-300" : "text-rose-300"}>{month.totalPnL}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <InsightCard title="Best pair" row={pairSummary.best} />
        <InsightCard title="Worst pair" row={pairSummary.worst} />
        <InsightCard title="Best setup" row={setupSummary.best} />
        <InsightCard title="Worst setup" row={setupSummary.worst} />
      </div>

      <div data-testid="dashboard-recent-trades" className="premium-card animate-fade-up mt-8 rounded-3xl p-8" style={{ animationDelay: "240ms" }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Recent trades</h2>
            <p className="mt-2 text-slate-400">Trade terbaru yang sudah kamu catat.</p>
          </div>
          <Link href="/trades" className="rounded-full border border-gold/20 px-4 py-2 text-sm text-gold transition hover:border-gold/50 hover:bg-gold/10">View all</Link>
        </div>
        {recentTrades.length === 0 ? (
          <div data-testid="dashboard-empty-state" className="mt-6 rounded-2xl border border-dashed border-gold/20 bg-gold/[0.04] p-8 text-center text-slate-400">
            <p className="text-lg font-semibold text-white">Catat trade pertama kamu</p>
            <p className="mx-auto mt-2 max-w-xl">Mulai journaling agar dashboard ini bisa menampilkan win rate, P/L, equity curve, dan insight pair/setup terbaik.</p>
            <Link href="/trades/new" className="premium-button mt-5 inline-flex rounded-full bg-gold px-5 py-3 font-semibold text-slate-950 hover:bg-goldLight">Add Trade</Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {recentTrades.map((trade) => (
              <Link key={trade.id} href={`/trades/${trade.id}`} className="interactive-card flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4 hover:bg-white/[0.06]">
                <span className="font-semibold">{trade.pair}</span>
                <span className="capitalize text-slate-300">{trade.result}</span>
                <span>{trade.profitLossAmount?.toString() ?? "—"}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
