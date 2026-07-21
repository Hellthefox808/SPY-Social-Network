"use client";

import React, { HTMLAttributes, memo } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface PillProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "blue" | "purple" | "emerald" | "amber" | "glass" | "ghost" | "plain";
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

const variantStyles: Record<NonNullable<PillProps["variant"]>, string> = {
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  purple: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  glass: "border-white/10 bg-white/5 text-white/90 backdrop-blur-md",
  ghost: "border-slate-800 bg-slate-900/40 text-slate-300",
  plain: "border-transparent text-white/90",
};

const sizeStyles: Record<NonNullable<PillProps["size"]>, string> = {
  sm: "px-2.5 py-0.5 text-xs gap-1.5",
  md: "px-3.5 py-1 text-sm gap-2",
};

export const Pill = memo(function Pill({
  variant = "blue",
  size = "sm",
  icon,
  className,
  children,
  ...props
}: PillProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-full border font-medium select-none w-fit transition-colors",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
});
