/**
 * Shared Framer Motion constants for Celebration Finds.
 * All values map 1:1 to DESIGN_SYSTEM.md motion tokens.
 */

export const LUXURY_EASE = [0.25, 0.1, 0.25, 1.0] as const;

export const transitions = {
  fast:   { duration: 0.15, ease: LUXURY_EASE },
  normal: { duration: 0.30, ease: LUXURY_EASE },
  slow:   { duration: 0.50, ease: LUXURY_EASE },
  spring: { type: "spring" as const, damping: 25, stiffness: 200 },
} as const;

/** Step cross-fade variants — opacity + 8px vertical slide */
export const stepVariants = {
  enter:  { opacity: 0, y: 8 },
  active: { opacity: 1, y: 0, transition: { ...transitions.normal } },
  exit:   { opacity: 0, y: -8, transition: { ...transitions.fast } },
};

/** Fade-in only (used for list items, summary lines) */
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { ...transitions.normal } },
  exit:   { opacity: 0, transition: { ...transitions.fast } },
};

/** Shake keyframes for validation errors on required fields */
export const shakeVariants = {
  shake: {
    x: [0, -8, 8, -4, 4, 0],
    transition: { duration: 0.4, ease: "easeInOut" as const },
  },
};

/**
 * Returns the appropriate transition, respecting prefers-reduced-motion.
 * Falls back to instant (duration: 0) for users who prefer reduced motion.
 */
export function getTransition(key: keyof typeof transitions) {
  if (typeof window !== "undefined") {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return { duration: 0 };
  }
  return transitions[key];
}
