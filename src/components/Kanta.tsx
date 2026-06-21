import { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";
import { prefersReducedMotion } from "../lib/motion";

/**
 * Kanta — 鏡 — the detective's magnifying lens.
 *
 * A circular brass-rimmed glass that drifts slowly across the portrait,
 * GENUINELY magnifying the photograph beneath. The lens is its own
 * <div> whose background-image is the SAME source photo, scaled ~1.6×.
 * As the lens moves over the portrait, background-position is mapped
 * so the area under the glass matches the photo behind it — like a
 * real lens, not an overlay icon.
 *
 * Photo plate (.kanta-plate) is owned by Hero so it stays inside the
 * existing entrance timeline (.hero-image animation). Kanta only owns
 * the lens disk.
 */
interface KantaProps {
  /** Full URL to the profile image (already BASE_URL-resolved by parent). */
  src: string;
  /** Magnification factor. Default 1.6. Lens + plate sizes are read from
   *  the rendered DOM (CSS-driven), so they stay correct across breakpoints. */
  zoom?: number;
}

export default function Kanta({ src, zoom = 1.6 }: KantaProps) {
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lens = lensRef.current;
    const plate = lens?.parentElement; // .hero-portrait (square)
    if (!lens || !plate) return;

    let scope: ReturnType<typeof createScope> | null = null;

    // Map the lens centre (x, y) within the plate to a background-position
    // on the magnified image so the glass shows the area beneath it.
    const setLensAt = (x: number, y: number, lensPx: number) => {
      const bgX = lensPx / 2 - x * zoom;
      const bgY = lensPx / 2 - y * zoom;
      lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
      lens.style.left = `${x - lensPx / 2}px`;
      lens.style.top = `${y - lensPx / 2}px`;
    };

    // (Re)build geometry from the ACTUAL rendered sizes — keeps the lens
    // correct across responsive breakpoints (e.g. 280px → 220px on mobile).
    const build = () => {
      const plateSize = plate.clientWidth;
      const lensPx = lens.offsetWidth;
      if (!plateSize || !lensPx) return;

      lens.style.backgroundSize = `${plateSize * zoom}px ${plateSize * zoom}px`;

      const pad = lensPx / 2 + 8;
      const min = pad;
      const max = plateSize - pad;
      const mid = plateSize / 2;

      // Start at the eyes — top-third of the portrait.
      setLensAt(mid, plateSize * 0.38, lensPx);

      scope?.revert();
      scope = null;
      if (prefersReducedMotion()) return;

      scope = createScope().add(() => {
        const proxy = { x: mid, y: plateSize * 0.38 };
        animate(proxy, {
          keyframes: [
            { x: max - 10, y: plateSize * 0.32 },
            { x: mid, y: plateSize * 0.62 },
            { x: min + 10, y: plateSize * 0.32 },
            { x: mid, y: plateSize * 0.38 },
          ],
          duration: 14000,
          ease: "inOut(2)",
          loop: true,
          onUpdate: () => setLensAt(proxy.x, proxy.y, lensPx),
        });
      });
    };

    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(plate);

    return () => {
      ro.disconnect();
      scope?.revert();
    };
  }, [src, zoom]);

  return (
    <div
      ref={lensRef}
      className="kanta-lens"
      aria-hidden="true"
      style={{
        backgroundImage: `url("${src}")`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
