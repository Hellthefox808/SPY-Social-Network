"use client";

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  center?: boolean;
}

const sizeStyles: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[90rem]",
  full: "max-w-full",
};

export function Container({
  size = "lg",
  center = true,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "w-full px-4 sm:px-6 md:px-8 lg:px-12",
          center && "mx-auto",
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
