"use client";

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number | string;
  duration?: number | string;
  animation?: "fadeSlideUp" | "fadeIn" | "zoomIn";
  as?: React.ElementType;
}

export function Reveal({
  delay = "0.2s",
  duration = "0.8s",
  animation = "fadeSlideUp",
  as: Component = "div",
  className,
  children,
  style,
  ...props
}: RevealProps) {
  const formattedDelay = typeof delay === "number" ? `${delay}s` : delay;
  const formattedDuration = typeof duration === "number" ? `${duration}s` : duration;

  const animationClass = `animate-[${animation}_${formattedDuration}_ease_${formattedDelay}_both]`;

  return (
    <Component
      className={twMerge(clsx(animationClass, className))}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}
