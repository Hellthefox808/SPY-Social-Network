"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>, HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "white" | "pill" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 border border-blue-400/20",
  secondary: "bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 backdrop-blur-md shadow-md",
  outline: "border border-slate-700/80 hover:border-blue-500/60 text-slate-300 hover:text-white bg-slate-950/40 hover:bg-blue-950/20 backdrop-blur-sm",
  white: "bg-white text-slate-950 font-semibold hover:bg-slate-100 shadow-lg shadow-white/10",
  pill: "rounded-full bg-white text-slate-950 font-semibold hover:bg-slate-100 shadow-lg shadow-white/10",
  ghost: "text-slate-400 hover:text-white bg-transparent hover:bg-slate-900/60 backdrop-blur-sm",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3.5 text-base rounded-2xl gap-3 font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "right",
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none select-none relative overflow-hidden group";

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={disabled || loading}
        className={twMerge(
          clsx(
            baseClasses,
            variantStyles[variant],
            sizeStyles[size],
            className
          )
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === "left" && (
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">{icon}</span>
        )}
        <span className="relative z-10">{children}</span>
        {!loading && icon && iconPosition === "right" && (
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
