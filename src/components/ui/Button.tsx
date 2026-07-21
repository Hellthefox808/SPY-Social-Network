"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "white" | "pill" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20",
  secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
  outline: "border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-transparent",
  white: "bg-white text-black font-medium hover:scale-105 transition-transform",
  pill: "rounded-full bg-white text-black font-medium hover:scale-105 transition-transform",
  ghost: "text-slate-400 hover:text-white bg-transparent hover:bg-slate-900/50",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-5 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
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
      "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none";

    return (
      <button
        ref={ref}
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
        {!loading && icon && iconPosition === "left" && icon}
        <span>{children}</span>
        {!loading && icon && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";
