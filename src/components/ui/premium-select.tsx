"use client";

import { useId, useState } from "react";

export type PremiumSelectOption = {
  value: string;
  label: string;
};

type PremiumSelectProps = {
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  options: PremiumSelectOption[];
  onValueChange?: (value: string) => void;
  dataTestId?: string;
  className?: string;
};

export function PremiumSelect({ name, value, defaultValue = "", options, onValueChange, dataTestId, className = "" }: PremiumSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(String(defaultValue));
  const selectedValue = typeof value === "undefined" ? internalValue : String(value);
  const selected = options.find((option) => option.value === selectedValue) ?? options[0];

  function choose(nextValue: string) {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
    setOpen(false);
  }

  return (
    <div data-testid={dataTestId ?? "premium-select"} className={`relative mt-2 ${className}`} onBlur={() => window.setTimeout(() => setOpen(false), 120)}>
      {name && <input name={name} value={selectedValue} readOnly className="hidden appearance-none" />}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950/95 to-slate-900/90 px-4 py-3 text-left text-sm text-white shadow-inner shadow-white/[0.03] outline-none transition hover:border-gold/35 hover:bg-slate-900 focus:border-gold/60 focus:ring-2 focus:ring-gold/30"
      >
        <span className={selected?.value ? "truncate" : "truncate text-slate-400"}>{selected?.label ?? "Select"}</span>
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-gold transition ${open ? "rotate-180 border-gold/30" : "group-hover:border-gold/30"}`}>⌄</span>
      </button>
      {open && (
        <div data-testid="premium-select-menu" role="listbox" aria-labelledby={id} className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-gold/20 bg-slate-950/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {options.map((option) => {
            const active = option.value === selectedValue;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option.value)}
                className={active ? "flex w-full items-center justify-between rounded-xl bg-gold/15 px-3 py-2.5 text-left text-sm font-semibold text-goldLight" : "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/[0.06] hover:text-white"}
              >
                <span>{option.label}</span>
                {active && <span className="text-gold">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
