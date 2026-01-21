import { motion, Transition, Variants } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  preset?: PageTransitionPreset;
}

export type PageTransitionPreset =
  | "fadeUp"
  | "fadeDown"
  | "slideLeft"
  | "slideRight"
  | "slideUp"
  | "slideDown"
  | "zoom"
  | "rotate"
  | "clipLeft"
  | "clipUp"
  | "flipX"
  | "flipY";

type PresetConfig = {
  variants: Variants;
  transition: Transition;
};

const presets: Record<PageTransitionPreset, PresetConfig> = {
  fadeUp: {
    variants: {
      initial: { opacity: 0, y: 20, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -10, scale: 0.98 },
    },
    transition: { type: "tween", ease: "easeInOut", duration: 0.3 },
  },
  fadeDown: {
    variants: {
      initial: { opacity: 0, y: -18, scale: 0.99 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 10, scale: 0.99 },
    },
    transition: { type: "tween", ease: "easeInOut", duration: 0.28 },
  },
  slideLeft: {
    variants: {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -24 },
    },
    transition: { type: "tween", ease: "easeOut", duration: 0.32 },
  },
  slideRight: {
    variants: {
      initial: { opacity: 0, x: -40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 24 },
    },
    transition: { type: "tween", ease: "easeOut", duration: 0.32 },
  },
  slideUp: {
    variants: {
      initial: { opacity: 0, y: 36 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -18 },
    },
    transition: { type: "tween", ease: "easeOut", duration: 0.34 },
  },
  slideDown: {
    variants: {
      initial: { opacity: 0, y: -36 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 18 },
    },
    transition: { type: "tween", ease: "easeOut", duration: 0.34 },
  },
  zoom: {
    variants: {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.98 },
    },
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
  rotate: {
    variants: {
      initial: { opacity: 0, rotate: -2, scale: 0.98 },
      animate: { opacity: 1, rotate: 0, scale: 1 },
      exit: { opacity: 0, rotate: 1, scale: 0.99 },
    },
    transition: { type: "tween", ease: "easeInOut", duration: 0.33 },
  },
  clipLeft: {
    variants: {
      initial: { opacity: 1, clipPath: "inset(0 100% 0 0)" },
      animate: { opacity: 1, clipPath: "inset(0 0% 0 0)" },
      exit: { opacity: 1, clipPath: "inset(0 0 0 100%)" },
    },
    transition: { type: "tween", ease: "easeInOut", duration: 0.4 },
  },
  clipUp: {
    variants: {
      initial: { opacity: 1, clipPath: "inset(100% 0 0 0)" },
      animate: { opacity: 1, clipPath: "inset(0% 0 0 0)" },
      exit: { opacity: 1, clipPath: "inset(0 0 100% 0)" },
    },
    transition: { type: "tween", ease: "easeInOut", duration: 0.4 },
  },
  flipX: {
    variants: {
      initial: { opacity: 0, rotateX: 18, y: 6, transformPerspective: 900 },
      animate: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 900 },
      exit: { opacity: 0, rotateX: -10, y: -4, transformPerspective: 900 },
    },
    transition: { type: "spring", stiffness: 220, damping: 22 },
  },
  flipY: {
    variants: {
      initial: { opacity: 0, rotateY: -18, x: -6, transformPerspective: 900 },
      animate: { opacity: 1, rotateY: 0, x: 0, transformPerspective: 900 },
      exit: { opacity: 0, rotateY: 10, x: 4, transformPerspective: 900 },
    },
    transition: { type: "spring", stiffness: 220, damping: 22 },
  },
};

export const PageTransition = ({ children, preset = "fadeUp" }: PageTransitionProps) => {
  const { variants, transition } = presets[preset] ?? presets.fadeUp;
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
