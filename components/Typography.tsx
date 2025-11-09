import React from "react";
import type {
  variant,
  color,
  textGradient,
  asType,
  className,
  children,
} from "../types/typography";
import { cn } from "@lib/utils";
type Props<T extends keyof React.JSX.IntrinsicElements> =
  React.ComponentProps<T>;
type BaseTypographyProps = Props<"p"> &
  Props<"h1"> &
  Props<"h2"> &
  Props<"h3"> &
  Props<"h4"> &
  Props<"h5"> &
  Props<"h6"> &
  Props<"a">;
export interface TypographyProps extends BaseTypographyProps {
  variant?: variant;
  color?: color;
  textGradient?: textGradient;
  as?: asType;
  className?: className;
  children: children;
}

export const Typography = ({
  variant = "p",
  color = "current",
  textGradient = false,
  as: Component = "p",
  className,
  children,
  ...props
}: TypographyProps) => {
  switch (variant) {
    case "h1":
      return (
        <h1
          className={cn(
            "text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl",
            className
          )}
        >
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2
          className={cn(
            "pb-2 text-3xl font-semibold tracking-tight scroll-m-20 first:mt-0",
            className
          )}
        >
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3
          className={cn(
            "text-2xl font-semibold tracking-tight scroll-m-20",
            className
          )}
          {...props}
        >
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4
          className={cn(
            "text-xl font-semibold tracking-tight scroll-m-20",
            className
          )}
          {...props}
        >
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5
          className={cn(
            "text-lg font-semibold tracking-tight scroll-m-20",
            className
          )}
          {...props}
        >
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6
          className={cn(
            "text-base font-semibold tracking-tight scroll-m-20",
            className
          )}
          {...props}
        >
          {children}
        </h6>
      );
    case "blockquote":
      return (
        <blockquote className={cn("pl-6 mt-6 italic border-l-2", className)}>
          {children}
        </blockquote>
      );
    case "lead":
      return (
        <p
          className={cn("text-xl text-muted-foreground", className)}
          {...props}
        >
          {children}
        </p>
      );
    case "large":
      return (
        <p className={cn("text-lg font-semibold", className)} {...props}>
          {children}
        </p>
      );
    case "small":
      return (
        <small
          className={cn("text-sm font-medium leading-none", className)}
          {...props}
        >
          {children}
        </small>
      );
    case "muted":
      return (
        <p
          className={cn("text-sm text-muted-foreground", className)}
          {...props}
        >
          {children}
        </p>
      );
    default:
      return (
        <Component className={className} {...props}>
          {children}
        </Component>
      );
  }
};
