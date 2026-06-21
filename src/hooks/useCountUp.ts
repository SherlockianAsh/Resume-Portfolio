import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { prefersReducedMotion, DUR, EASE } from "../lib/motion";

/**
 * Count-up number animation, triggered once when the element scrolls into view.
 *
 * Returns a ref to attach to the display element and the current integer value.
 * Under reduced motion it snaps straight to the target (no animation).
 *
 * Usage:
 *   const { ref, value } = useCountUp(stat.count);
 *   <div ref={ref} className="stat-number">{value}{stat.suffix}</div>
 */
export function useCountUp(target: number, duration: number = DUR.count) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(prefersReducedMotion() ? target : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: the useState initializer already seeds `target`, so there
    // is nothing to animate (and no setState-in-effect needed).
    if (prefersReducedMotion()) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          obs.unobserve(entry.target);
          const counter = { n: 0 };
          animate(counter, {
            n: target,
            duration,
            ease: EASE.out,
            onUpdate: () => setValue(Math.round(counter.n)),
          });
        }
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { ref, value };
}
