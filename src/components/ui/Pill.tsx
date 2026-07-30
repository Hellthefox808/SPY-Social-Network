"use client";

import React, { HTMLAttributes, memo } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, HTMLMotionProps } from "framer-motion";

export interface PillProps extends Omit<HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<"div">>, HTMLMotionProps<"div"> {
  variant?: "blue" | "purple" | "emerald" | "amber" | "glass" | "ghost" | "plain";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<NonNullable<PillProps["variant"]>, string> = {
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-300 shadow-sm shadow-blue-500/10 backdrop-blur-md",
  purple: "border-purple-500/30 bg-purple-500/10 text-purple-300 shadow-sm shadow-purple-500/10 backdrop-blur-md",
  emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-sm shadow-emerald-500/10 backdrop-blur-md",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-sm shadow-amber-500/10 backdrop-blur-md",
  glass: "border-white/15 bg-white/10 text-white/95 backdrop-blur-lg shadow-md",
  ghost: "border-slate-800/80 bg-slate-900/60 text-slate-300 backdrop-blur-sm",
  plain: "border-transparent text-white/90",
};

const sizeStyles: Record<NonNullable<PillProps["size"]>, string> = {
  sm: "px-3 py-1 text-xs gap-1.5",
  md: "px-4 py-1.5 text-sm gap-2 font-medium",
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
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
    </motion.div>
  );
});
