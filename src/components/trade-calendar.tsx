"use client";

import { useMemo, useState } from "react";
import { PremiumSelect } from "@/components/ui/premium-select";

type CalendarTrade = {
  id: string;
  openDate: string;
  profitLossAmount: number | null;
};

type DaySummary = {
  trades: CalendarTrade[];
  totalPnL: number;
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function moveMonth(year: number, month: number, delta: number) {
  const next = new Date(Date.UTC(year, month + delta, 1));
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() };
}

function buildCalendarCells(year: number, month: number) {
  const firstDay = new Date(Date.UTC(year, month, 1));
  const startOffset = firstDay.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: Array<{ date: Date; inMonth: boolean }> = [];

  for (let index = 0; index < 42; index += 1) {
    const day = index - startOffset + 1;
    const date = new Date(Date.UTC(year, month, day));
    cells.push({ date, inMonth: day >= 1 && day <= daysInMonth });
  }

  return cells;
}

export function TradeCalendar({ trades }: { trades: CalendarTrade[] }) {
  const initialDate = trades[0]?.openDate ? new Date(trades[0].openDate) : new Date();
  const [visibleYear, setVisibleYear] = useState(initialDate.getUTCFullYear());
  const [visibleMonth, setVisibleMonth] = useState(initialDate.getUTCMonth());

  const years = useMemo(() => {
    const tradeYears = trades.map((trade) => new Date(trade.openDate).getUTCFullYear());
    const min = Math.min(visibleYear, ...tradeYears, new Date().getUTCFullYear()) - 1;
    const max = Math.max(visibleYear, ...tradeYears, new Date().getUTCFullYear()) + 1;
    return Array.from({ length: max - min + 1 }, (_, index) => min + index);
  }, [trades, visibleYear]);

  const summaries = useMemo(() => {
    const grouped = new Map<string, DaySummary>();
    for (const trade of trades) {
      const key = dateKey(new Date(trade.openDate));
      const existing = grouped.get(key) ?? { trades: [], totalPnL: 0 };
      existing.trades.push(trade);
      existing.totalPnL = Math.round((existing.totalPnL + (trade.profitLossAmount ?? 0)) * 100) / 100;
      grouped.set(key, existing);
    }
    return grouped;
  }, [trades]);

  const monthTrades = trades.filter((trade) => {
    const date = new Date(trade.openDate);
    return date.getUTCFullYear() === visibleYear && date.getUTCMonth() === visibleMonth;
  });
  const monthPnL = Math.round(monthTrades.reduce((sum, trade) => sum + (trade.profitLossAmount ?? 0), 0) * 100) / 100;
  const cells = buildCalendarCells(visibleYear, visibleMonth);

  function goToMonth(delta: number) {
    const next = moveMonth(visibleYear, visibleMonth, delta);
    setVisibleYear(next.year);
    setVisibleMonth(next.month);
  }

  return (
    <div data-testid="trade-calendar" className="dropdown-layer mt-5 rounded-3xl border border-white/10 bg-slate-950/45 p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-slate-400">{monthTrades.length} trades this month</p>
          <p className={monthPnL >= 0 ? "mt-1 text-2xl font-semibold text-emerald-300" : "mt-1 text-2xl font-semibold text-rose-300"}>{monthPnL} P/L</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button data-testid="calendar-prev-month" aria-label="Previous month" type="button" onClick={() => goToMonth(-1)} className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-gold/40 hover:bg-gold/10">←</button>
          <PremiumSelect dataTestId="calendar-month-select" value={visibleMonth} onValueChange={(nextValue) => setVisibleMonth(Number(nextValue))} options={monthNames.map((month, index) => ({ value: String(index), label: month }))} className="mt-0 min-w-32" />
          <PremiumSelect dataTestId="calendar-year-select" value={visibleYear} onValueChange={(nextValue) => setVisibleYear(Number(nextValue))} options={years.map((year) => ({ value: String(year), label: String(year) }))} className="mt-0 min-w-28" />
          <button data-testid="calendar-next-month" aria-label="Next month" type="button" onClick={() => goToMonth(1)} className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-gold/40 hover:bg-gold/10">→</button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-wider text-slate-500">
        {weekdays.map((day) => <div key={day}>{day}</div>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map(({ date, inMonth }) => {
          const summary = summaries.get(dateKey(date));
          const tone = !summary ? "border-white/5 bg-white/[0.02]" : summary.totalPnL >= 0 ? "border-emerald-400/30 bg-emerald-400/10" : "border-rose-400/30 bg-rose-400/10";
          return (
            <div key={date.toISOString()} className={`group min-h-24 rounded-xl border p-2 text-left transition hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/[0.06] ${tone} ${inMonth ? "opacity-100" : "opacity-35"}`} title={summary ? `${summary.trades.length} trades • ${summary.totalPnL} P/L` : "No trades"}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-200">{date.getUTCDate()}</span>
                {summary && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">{summary.trades.length}</span>}
              </div>
              {summary && (
                <div className="mt-3 space-y-1">
                  <p className={summary.totalPnL >= 0 ? "text-xs font-semibold text-emerald-300" : "text-xs font-semibold text-rose-300"}>{summary.totalPnL}</p>
                  <p className="text-[11px] text-slate-400">{summary.trades.length} {summary.trades.length === 1 ? "trade" : "trades"}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
