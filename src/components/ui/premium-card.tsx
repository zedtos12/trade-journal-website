import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type PremiumCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function PremiumCard<T extends ElementType = "div">({
  as,
  children,
  className = "",
  interactive = false,
  ...props
}: PremiumCardProps<T>) {
  const Component = as ?? "div";
  const classes = ["premium-card rounded-3xl", interactive ? "interactive-card" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
