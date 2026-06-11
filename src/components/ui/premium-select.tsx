"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [internalValue, setInternalValue] = useState(String(defaultValue));
  const selectedValue = typeof value === "undefined" ? internalValue : String(value);
  const selected = options.find((option) => option.value === selectedValue) ?? options[0];

  function updateMenuPosition() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setMenuPosition({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  }

  function choose(nextValue: string) {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
    setOpen(false);
  }

  useLayoutEffect(() => {
    if (open) updateMenuPosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", updateMenuPosition, true);
    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("scroll", updateMenuPosition, true);
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [open]);

  return (
    <div data-testid={dataTestId ?? "premium-select"} className={`relative mt-2 ${open ? "z-[90]" : "z-0"} ${className}`} onBlur={() => window.setTimeout(() => setOpen(false), 120)}>
      {name && <input name={name} value={selectedValue} readOnly className="hidden appearance-none" />}
      <button
        ref={buttonRef}
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
        <div data-testid="premium-select-menu" role="listbox" aria-labelledby={id} style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }} className="premium-select-scrollbar fixed z-[9999] max-h-72 overflow-auto rounded-2xl border border-gold/20 bg-slate-950/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
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
