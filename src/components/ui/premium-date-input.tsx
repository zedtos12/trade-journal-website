"use client";

import { useMemo, useState } from "react";
import { PremiumSelect } from "@/components/ui/premium-select";

type PremiumDateInputProps = {
  name: string;
  defaultValue?: string;
  required?: boolean;
  ariaLabel?: string;
  placeholder?: string;
  dataTestId?: string;
  className?: string;
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayFormatter = new Intl.DateTimeFormat("en", { weekday: "short" });

function parseDateValue(value?: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const start = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function PremiumDateInput({ name, defaultValue = "", required = false, ariaLabel, placeholder = "YYYY-MM-DD", dataTestId = "premium-date-input", className = "" }: PremiumDateInputProps) {
  const parsedDefault = parseDateValue(defaultValue);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [visibleMonth, setVisibleMonth] = useState(parsedDefault ?? new Date());
  const selectedDate = parseDateValue(value);
  const todayValue = toDateValue(new Date());
  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const weekdays = useMemo(() => buildCalendarDays(new Date(2024, 0, 7)).slice(0, 7), []);

  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const min = currentYear - 5;
    const max = currentYear + 5;
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [currentYear]);

  function moveMonth(delta: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  function chooseDate(date: Date) {
    setValue(toDateValue(date));
    setVisibleMonth(date);
    setOpen(false);
  }

  function chooseToday() {
    chooseDate(new Date());
  }

  return (
    <div
      data-testid={dataTestId}
      data-premium-date-open={open ? "true" : undefined}
      className={`relative mt-2 ${open ? "z-[90]" : "z-0"} ${className}`}
      onBlur={() => window.setTimeout(() => setOpen(false), 120)}
    >
      <div className="group flex w-full items-center gap-2 rounded-xl border border-white/10 bg-gradient-to-b from-slate-950/95 to-slate-900/90 px-3 py-2.5 shadow-inner shadow-white/[0.03] transition hover:border-gold/35 focus-within:border-gold/60 focus-within:ring-2 focus-within:ring-gold/30">
        <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <input
          name={name}
          value={value}
          required={required}
          readOnly
          tabIndex={-1}
          aria-label={ariaLabel}
          placeholder={placeholder}
          onClick={() => setOpen(true)}
          className="min-w-0 flex-1 cursor-pointer bg-transparent text-sm text-white outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
        />
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`Open ${ariaLabel ?? name} calendar`}
          onClick={() => setOpen((current) => !current)}
          className="shrink-0"
        >
          <svg className={`h-4 w-4 text-gold transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {open && (
        <div role="dialog" aria-label={`${ariaLabel ?? name} calendar`} className="absolute left-0 top-full z-[9999] mt-2 w-full min-w-72 rounded-3xl border border-gold/20 bg-slate-950/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="flex items-center gap-2" onMouseDown={(e) => e.preventDefault()}>
            <button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-slate-200 transition hover:border-gold/40 hover:text-gold">‹</button>
            <PremiumSelect
              value={visibleMonth.getMonth()}
              onValueChange={(nextMonth) => setVisibleMonth(new Date(visibleMonth.getFullYear(), Number(nextMonth), 1))}
              options={monthNames.map((month, index) => ({ value: String(index), label: month }))}
              className="mt-0 flex-1"
            />
            <PremiumSelect
              value={visibleMonth.getFullYear()}
              onValueChange={(nextYear) => setVisibleMonth(new Date(Number(nextYear), visibleMonth.getMonth(), 1))}
              options={years.map((year) => ({ value: String(year), label: String(year) }))}
              className="mt-0 w-28"
            />
            <button type="button" aria-label="Next month" onClick={() => moveMonth(1)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-slate-200 transition hover:border-gold/40 hover:text-gold">›</button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-slate-400">
            {weekdays.map((date) => <span key={date.toISOString()}>{dayFormatter.format(date).slice(0, 2)}</span>)}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const dateValue = toDateValue(date);
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
              const isSelected = selectedDate ? dateValue === toDateValue(selectedDate) : false;
              const isToday = dateValue === todayValue;
              return (
                <button
                  key={dateValue}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => chooseDate(date)}
                  className={isSelected
                    ? "aspect-square rounded-xl bg-gold text-sm font-bold text-slate-950 shadow-lg shadow-gold/20"
                    : `aspect-square rounded-xl text-sm transition hover:bg-white/[0.08] hover:text-white ${isCurrentMonth ? "text-slate-200" : "text-slate-600"} ${isToday ? "ring-1 ring-gold/50" : ""}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
            <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setValue("")} className="rounded-full px-3 py-2 text-xs text-slate-400 transition hover:bg-white/[0.06] hover:text-white">Clear</button>
            <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={chooseToday} className="premium-button rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-950">Today</button>
          </div>
        </div>
      )}
    </div>
  );
}
