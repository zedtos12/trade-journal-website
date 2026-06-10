import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: "gold" | "ghost";
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type AnimatedButtonProps = ButtonProps | AnchorProps;

const variants = {
  gold: "bg-gold text-slate-950 shadow-lg shadow-gold/20 hover:bg-goldLight",
  ghost: "border border-white/15 text-white hover:border-gold/50 hover:bg-white/5",
};

export function AnimatedButton({
  children,
  className = "",
  variant = "gold",
  ...props
}: AnimatedButtonProps) {
  const classes = [
    "premium-button inline-flex items-center justify-center rounded-full px-6 py-3 text-center font-semibold",
    variants[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    return (
      <a className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonProps)}>
      {children}
    </button>
  );
}
