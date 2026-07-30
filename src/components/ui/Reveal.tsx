"use client";

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, HTMLMotionProps, Variants } from "framer-motion";

export interface RevealProps extends Omit<HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<"div">>, HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  children?: React.ReactNode;
}

export function Reveal({
  delay = 0,
  duration = 0.5,
  direction = "up",
  className,
  children,
  ...props
}: RevealProps) {
  const getVariants = (): Variants => {
    let x = 0;
    let y = 0;
    if (direction === "up") y = 24;
    if (direction === "down") y = -24;
    if (direction === "left") x = 24;
    if (direction === "right") x = -24;

    return {
      hidden: { opacity: 0, x, y },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      },
    };
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={getVariants()}
      className={twMerge(clsx(className))}
      {...props}
    >
      {children}
    </motion.div>
  );
}
