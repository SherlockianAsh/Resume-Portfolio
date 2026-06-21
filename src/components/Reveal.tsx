import { useEffect, useRef } from "react";
import { animate, stagger as animeStagger } from "animejs";
import { prefersReducedMotion, REVEAL } from "../lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /**
   * When set, stagger-animate descendants matching this selector instead of the
   * wrapper itself (e.g. "[data-reveal-item]" for card grids).
   */
  staggerSelector?: string;
  /** Extra delay before the reveal begins (ms). */
  delay?: number;
  /** translateY start offset (px); overrides the REVEAL default. */
  y?: number;
}

/**
 * Scroll-reveal wrapper. Hidden initially via the [data-reveal] CSS state, then
 * animated in once when it enters the viewport (IntersectionObserver → anime.js).
 *
 * Accessibility: under prefers-reduced-motion / print, the CSS kill-switch forces
 * content visible and this effect short-circuits — no motion, no hidden content.
 */
export default function Reveal({
  children,
  className,
  staggerSelector,
  delay = 0,
  y = REVEAL.y,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: CSS already forces visibility; nothing to animate.
    if (prefersReducedMotion()) return;

    const targets: HTMLElement[] = staggerSelector
      ? Array.from(el.querySelectorAll<HTMLElement>(staggerSelector))
      : [el];

    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          obs.unobserve(entry.target);
          animate(targets, {
            opacity: [0, 1],
            translateY: [y, 0],
            duration: REVEAL.duration,
            ease: REVEAL.ease,
            delay: staggerSelector
              ? animeStagger(REVEAL.stagger, { start: delay })
              : delay,
          });
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [staggerSelector, delay, y]);

  // In stagger mode the wrapper stays visible — only the matched children are
  // hidden + animated. Otherwise the wrapper itself is the reveal target.
  return (
    <div ref={ref} className={className} {...(!staggerSelector && { "data-reveal": "" })}>
      {children}
    </div>
  );
}
