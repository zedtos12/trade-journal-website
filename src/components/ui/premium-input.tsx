import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const PremiumInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);
PremiumInput.displayName = "PremiumInput";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const PremiumTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);
PremiumTextarea.displayName = "PremiumTextarea";
