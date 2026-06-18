import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export const PremiumButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    let baseClass = "relative inline-flex items-center justify-center rounded-full px-6 py-2.5 font-semibold transition overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed";
    
    if (variant === "primary") {
      baseClass += " bg-gold text-slate-950 hover:bg-goldLight shadow-lg shadow-gold/10 premium-button";
    } else if (variant === "secondary") {
      baseClass += " border border-white/10 bg-white/5 text-slate-200 hover:border-gold/30 hover:bg-white/10 hover:text-white";
    } else if (variant === "danger") {
      baseClass += " border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:border-rose-400/40 hover:bg-rose-500/20 hover:text-rose-200 focus:ring-2 focus:ring-rose-400/30";
    } else if (variant === "ghost") {
      baseClass += " text-slate-300 hover:text-white hover:bg-white/5";
    }

    return (
      <button ref={ref} className={`${baseClass} ${className}`} {...props} />
    );
  }
);
PremiumButton.displayName = "PremiumButton";
