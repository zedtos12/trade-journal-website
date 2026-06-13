"use client";

import { useMemo, useState } from "react";

type PremiumDateInputProps = {
  name: string;
  defaultValue?: string;
  required?: boolean;
  ariaLabel?: string;
  placeholder?: string;
  dataTestId?: string;
  className?: string;
};

const monthFormatter = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });
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
      <div className="group flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950/95 to-slate-900/90 px-3 py-2.5 shadow-inner shadow-white/[0.03] transition hover:border-gold/35 focus-within:border-gold/60 focus-within:ring-2 focus-within:ring-gold/30">
        <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-sm text-gold transition group-hover:border-gold/30">◷</span>
        <input
          name={name}
          value={value}
          required={required}
          pattern="\d{4}-\d{2}-\d{2}"
          inputMode="numeric"
          aria-label={ariaLabel}
          placeholder={placeholder}
          onChange={(event) => {
            const nextValue = event.target.value;
            setValue(nextValue);
            const nextDate = parseDateValue(nextValue);
            if (nextDate) setVisibleMonth(nextDate);
          }}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`Open ${ariaLabel ?? name} calendar`}
          onClick={() => setOpen((current) => !current)}
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-gold transition hover:border-gold/40 hover:bg-gold/10 ${open ? "rotate-180 border-gold/40 bg-gold/10" : ""}`}
        >
          ⌄
        </button>
      </div>

      {open && (
        <div role="dialog" aria-label={`${ariaLabel ?? name} calendar`} className="absolute left-0 top-full z-[9999] mt-2 w-full min-w-72 rounded-3xl border border-gold/20 bg-slate-950/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2">
            <button type="button" aria-label="Previous month" onMouseDown={(event) => event.preventDefault()} onClick={() => moveMonth(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-200 transition hover:border-gold/40 hover:text-gold">‹</button>
            <p className="text-sm font-semibold text-white">{monthFormatter.format(visibleMonth)}</p>
            <button type="button" aria-label="Next month" onMouseDown={(event) => event.preventDefault()} onClick={() => moveMonth(1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-200 transition hover:border-gold/40 hover:text-gold">›</button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-slate-500">
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
                    ? "aspect-square rounded-2xl bg-gold text-sm font-bold text-slate-950 shadow-lg shadow-gold/20"
                    : `aspect-square rounded-2xl text-sm transition hover:bg-white/[0.08] hover:text-white ${isCurrentMonth ? "text-slate-200" : "text-slate-600"} ${isToday ? "ring-1 ring-gold/50" : ""}`}
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
