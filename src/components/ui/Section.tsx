"use client";

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  fullscreen?: boolean;
}

const paddingStyles: Record<NonNullable<SectionProps["padding"]>, string> = {
  none: "py-0",
  sm: "py-6 sm:py-8",
  md: "py-12 sm:py-16",
  lg: "py-16 sm:py-24",
  xl: "py-24 sm:py-32",
};

export function Section({
  padding = "md",
  fullscreen = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={twMerge(
        clsx(
          "relative w-full overflow-hidden",
          fullscreen ? "h-screen min-h-screen" : paddingStyles[padding],
          className
        )
      )}
      {...props}
    >
      {children}
    </section>
  );
}
