import * as React from "react";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "win" | "loss" | "neutral" | "gold";
  className?: string;
};

export function PremiumBadge({ children, variant = "neutral", className = "" }: BadgeProps) {
  let baseClass = "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest";
  
  if (variant === "win") {
    baseClass += " border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  } else if (variant === "loss") {
    baseClass += " border-rose-500/30 bg-rose-500/10 text-rose-300";
  } else if (variant === "gold") {
    baseClass += " border-gold/40 bg-gold/10 text-goldLight";
  } else {
    baseClass += " border-white/10 bg-white/5 text-slate-300";
  }

  return (
    <span className={`${baseClass} ${className}`}>
      {children}
    </span>
  );
}
