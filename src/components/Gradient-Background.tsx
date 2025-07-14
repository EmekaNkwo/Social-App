"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
  blurIntensity?: "light" | "medium" | "strong";
}

interface ContentCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated";
}

interface ContainerProps {
  children?: ReactNode;
  className?: string;
  delay?: number;
  maxWidth?: string;
  aspectRatio?: string;
  withImage?: string;
}

type GradientDirection =
  | "to-r"
  | "to-l"
  | "to-b"
  | "to-t"
  | "to-br"
  | "to-bl"
  | "to-tr"
  | "to-tl";

export interface GradientCardProps {
  children: ReactNode;
  className?: string;

  // Gradient styling
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: GradientDirection;
  gradientOpacity?: number; // 0-100

  // Animation
  animation?: "none" | "fade" | "scale" | "slide";
  animationDuration?: number; // ms
  animationDelay?: number; // ms
  animationEasing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";

  // Hover effects
  hoverEffect?: boolean;
  hoverScale?: boolean | number; // true = 1.02, or custom scale
  hoverShadow?: boolean | "sm" | "md" | "lg" | "xl" | "2xl";

  // Styling
  borderGradient?: boolean;
  borderWidth?: "xs" | "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner";

  // Layout
  fullWidth?: boolean;
  fullHeight?: boolean;

  // Accessibility
  ariaLabel?: string;
  role?: string;

  // Custom styles
  style?: React.CSSProperties;

  // Event handlers
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export function GradientBackground({
  children,
  className = "",
  blurIntensity = "medium",
}: GradientBackgroundProps) {
  const blurMap = {
    light: "blur-2xl",
    medium: "blur-3xl",
    strong: "blur-[100px]",
  };

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
    >
      {/* Background gradient elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className={`absolute -left-[15%] top-[-10%] h-[120vh] w-[50%] bg-gradient-to-br from-primary/40 via-primary/10 to-background/5 ${blurMap[blurIntensity]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className={`absolute -right-[15%] bottom-[-10%] h-[100vh] w-[50%] bg-gradient-to-tl from-primary/40 via-primary/10 to-background/5 ${blurMap[blurIntensity]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
}

export function Container({
  children,
  className = "",
  delay = 0.5,
  maxWidth = "max-w-4xl",
  aspectRatio = "",
  withImage,
}: ContainerProps) {
  return (
    <motion.div
      className={`w-full ${maxWidth} ${className}`}
      variants={fadeIn("up", "spring", delay, 1)}
    >
      <div
        className={`flex w-full overflow-hidden border border-border/50 bg-gradient-to-br from-background to-muted/50 shadow-2xl ${
          aspectRatio ? aspectRatio : ""
        }`}
      >
        <div className="flex w-full flex-1 flex-col justify-center p-8 md:w-1/2">
          {children}
        </div>
        {withImage && (
          <div className="relative hidden h-auto w-1/2 md:block">
            {typeof withImage === "string" ? (
              <Image
                src={withImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function GradientCard({
  children,
  className,
  // Gradient styling
  gradientFrom = "from-primary/10",
  gradientTo = "to-secondary/10",
  gradientDirection = "to-br",
  gradientOpacity = 80,
  // Animation
  animation = "fade",
  animationDuration: duration = 500, // in ms
  animationDelay: delay = 0, // in ms
  animationEasing = "ease-out",
  // Hover effects
  hoverEffect = true,
  hoverScale = false,
  hoverShadow = "lg",
  // Styling
  borderGradient = false,
  borderWidth = "md",
  rounded = "xl",
  shadow = "md",
  // Layout
  fullWidth = false,
  fullHeight = false,
  // Accessibility
  ariaLabel,
  role,
  // Event handlers
  onClick,
  onMouseEnter,
  onMouseLeave,
  // Custom styles
  style,
}: GradientCardProps) {
  const borderWidths = { xs: "0.5px", sm: "1px", md: "2px", lg: "3px" };

  const borderClass = borderGradient
    ? `before:absolute before:inset-0 before:rounded-${rounded} before:p-[${borderWidths[borderWidth]}] before:bg-gradient-to-${gradientDirection} before:from-primary/30 before:to-secondary/30 before:-z-10`
    : "";

  const animationClasses = {
    none: "",
    fade: "animate-fade-in",
    scale: "animate-scale-in",
    slide: "animate-slide-up",
  };

  const hoverClasses = cn({
    "transition-all duration-300": hoverEffect,
    "hover:shadow-lg": hoverEffect && hoverShadow === true,
    [`hover:shadow-${hoverShadow}`]:
      hoverEffect && typeof hoverShadow === "string",
    "hover:scale-[1.02]": hoverEffect && hoverScale === true,
    [`hover:scale-[${hoverScale}]`]:
      hoverEffect && typeof hoverScale === "number",
  });

  // If inside GradientBackground, adjust the background opacity
  const isInsideGradientBg = false; // You might want to use context or prop to detect this

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        `rounded-${rounded}`,
        `shadow-${shadow}`,
        borderGradient ? "bg-transparent" : "bg-background",
        hoverClasses,
        animationClasses[animation],
        borderClass,
        {
          "w-full": fullWidth,
          "h-full": fullHeight,
          "bg-background/80": isInsideGradientBg, // Slightly transparent when inside gradient bg
        },
        className,
        `duration-[${duration}ms] delay-[${delay}ms]`,
      )}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationTimingFunction: animationEasing,
        ...style,
      }}
      aria-label={ariaLabel}
      role={role}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={cn(
          "h-full w-full",
          `bg-gradient-to-${gradientDirection}`,
          gradientFrom,
          gradientTo,
          `rounded-${rounded}`,
          `opacity-${gradientOpacity}`,
          borderGradient ? "m-[1px]" : "",
          "transition-all duration-300",
          {
            "bg-background/90": isInsideGradientBg, // Ensure content remains readable
          },
        )}
      >
        <div
          className={cn(
            "h-full w-full",
            `bg-background/${isInsideGradientBg ? "95" : "80"}`,
            "backdrop-blur-sm",
            `rounded-${rounded}`,
            "p-6",
            "transition-all duration-300",
            isInsideGradientBg
              ? "hover:bg-background/95"
              : "hover:bg-background/90",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function ContentCard({
  children,
  className,
  variant = "default",
}: ContentCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/20 p-6 backdrop-blur-sm transition-all duration-200",
        // Brighter background with more contrast
        "bg-gradient-to-br from-background/95 to-muted/40",
        // Stronger shadow for better depth
        "shadow-[0_4px_15px_rgba(0,0,0,0.15)]",
        "hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]",
        // Dark mode adjustments
        "dark:from-background/95 dark:to-muted/30",
        "dark:shadow-[0_4px_15px_rgba(0,0,0,0.4)]",
        "dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.5)]",
        // Elevated variant
        variant === "elevated" && "border-primary/30 shadow-xl",
        // Add a subtle glow on hover for better feedback
        "hover:ring-1 hover:ring-primary/10",
        className,
      )}
    >
      {children}
    </div>
  );
}
