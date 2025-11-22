/**
 * File overview: src/components/ui/flip-button.tsx
 *
 * React component `flip-button` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
"use client";

import * as React from "react";
import { type HTMLMotionProps, type Transition, type Variant, motion } from "motion/react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type FlipDirection = "top" | "bottom" | "left" | "right";

interface FlipButtonProps {
  frontText: string;
  backText: string;
  transition?: Transition;
  frontClassName?: string;
  backClassName?: string;
  from?: FlipDirection;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: () => void;
}

const defaultSpanClassName = "absolute inset-0 flex items-center justify-center rounded-lg";

const FlipButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, FlipButtonProps>(
  (
    {
      frontText,
      backText,
      transition = { type: "spring", stiffness: 280, damping: 20 },
      className,
      frontClassName,
      backClassName,
      from = "top",
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const isVertical = from === "top" || from === "bottom";
    const rotateAxis = isVertical ? "rotateX" : "rotateY";

    const frontOffset = from === "top" || from === "left" ? "50%" : "-50%";
    const backOffset = from === "top" || from === "left" ? "-50%" : "50%";

    const buildVariant = (
      opacity: number,
      rotation: number,
      offset: string | null = null
    ): Variant => ({
      opacity,
      [rotateAxis]: rotation,
      ...(isVertical && offset !== null ? { y: offset } : {}),
      ...(!isVertical && offset !== null ? { x: offset } : {}),
    });

    const frontVariants = {
      initial: buildVariant(1, 0, "0%"),
      hover: buildVariant(0, 90, frontOffset),
    };

    const backVariants = {
      initial: buildVariant(0, 90, backOffset),
      hover: buildVariant(1, 0, "0%"),
    };

    const isExternal = href?.startsWith("http");
    const MotionLink = motion(Link);

    const sharedProps = {
      ref: ref as any,
      initial: "initial" as const,
      whileHover: "hover" as const,
      whileTap: { scale: 0.95 },
      className: cn(
        "relative inline-block h-10 px-4 py-2 text-sm font-medium cursor-pointer perspective-[1000px] focus:outline-none",
        className
      ),
    };

    const content = (
      <>
        <motion.span
          variants={frontVariants}
          transition={transition}
          className={cn(defaultSpanClassName, "bg-foreground text-background", frontClassName)}
        >
          {frontText}
        </motion.span>
        <motion.span
          variants={backVariants}
          transition={transition}
          className={cn(
            defaultSpanClassName,
            "bg-background text-foreground border border-border",
            backClassName
          )}
        >
          {backText}
        </motion.span>
        <span className="invisible">{frontText}</span>
      </>
    );

    return isExternal ? (
      <motion.a {...sharedProps} href={href} target={target} rel={rel}>
        {content}
      </motion.a>
    ) : (
      <MotionLink {...sharedProps} to={href || "/"}>
        {content}
      </MotionLink>
    );
  }
);

FlipButton.displayName = "FlipButton";

export default FlipButton;
export { FlipButton, type FlipButtonProps, type FlipDirection };
