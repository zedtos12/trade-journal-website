import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type AnimatedShellProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  delayMs?: number;
  animation?: "fade-up" | "fade-in" | "scale-in";
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "style"> & {
    style?: ComponentPropsWithoutRef<T>["style"];
  };

const animationClass = {
  "fade-up": "animate-fade-up",
  "fade-in": "animate-fade-in",
  "scale-in": "animate-scale-in",
};

export function AnimatedShell<T extends ElementType = "div">({
  as,
  children,
  className = "",
  delayMs = 0,
  animation = "fade-up",
  style,
  ...props
}: AnimatedShellProps<T>) {
  const Component = as ?? "div";
  const classes = [animationClass[animation], className].filter(Boolean).join(" ");

  return (
    <Component className={classes} style={{ animationDelay: `${delayMs}ms`, ...style }} {...props}>
      {children}
    </Component>
  );
}
