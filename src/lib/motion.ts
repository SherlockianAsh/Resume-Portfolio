/**
 * Motion layer — shared animation primitives for the tech-savvy revamp.
 *
 * Single source of truth for timing/easing + the accessibility gate.
 * Every animation in the app routes through `prefersReducedMotion()` so the
 * CSS kill-switch in motion.css (print + reduced-motion) and the JS paths agree.
 */

/** True when the user (or the print path) has asked to suppress motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Scroll-reveal defaults (used by <Reveal> + section sweeps). */
export const REVEAL = {
  duration: 620,
  ease: "out(3)",
  stagger: 70,
  /** translateY start offset, px */
  y: 24,
} as const;

/** General-purpose duration scale (ms). */
export const DUR = {
  fast: 200,
  base: 420,
  slow: 720,
  count: 1600,
} as const;

/** Easing presets (anime.js v4 string form). */
export const EASE = {
  out: "out(3)",
  inOut: "inOut(2)",
  spring: "outElastic(1, .6)",
} as const;
