import { Variants } from "framer-motion";

export const fadeIn = (
  direction: "up" | "down" | "left" | "right",
  type: "spring" | "tween" | "inertia" | "keyframes" = "tween",
  delay: number,
  duration: number,
): Variants => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type,
      delay: delay,
      duration: duration,
      ease: "easeOut",
    },
  },
});

export const staggerContainer = (
  staggerChildren?: number,
  delayChildren?: number,
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerChildren || 0.1,
      delayChildren: delayChildren || 0,
    },
  },
});
export const textVariant = (delay: number): Variants => ({
  hidden: { y: 50, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", duration: 1.25, delay: delay },
  },
});
