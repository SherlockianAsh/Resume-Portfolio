import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";

/**
 * Loupe — a circular magnifying-glass cursor that follows the mouse
 * across a container of case cards. On pointer:fine + motion-on, hovering
 * any element marked [data-loupe-target] swaps the cursor for the loupe
 * and reveals the .loupe-detail panel inside that card.
 *
 * Touch / coarse-pointer / reduced-motion users: hook is a no-op, and the
 * CSS fallback (showcase.css) keeps the detail panel visible-on-hover /
 * tap-to-expand instead.
 */
export default function Loupe({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const loupeRef = useRef<HTMLDivElement | null>(null);
  // Feature-detect once at init (client-only SPA): fine pointer + motion on.
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      !prefersReducedMotion() &&
      !!window.matchMedia &&
      window.matchMedia("(pointer: fine)").matches,
  );

  useEffect(() => {
    if (!enabled) return;
    const root = containerRef.current;
    const loupe = loupeRef.current;
    if (!root || !loupe) return;

    let raf = 0;
    let mx = 0;
    let my = 0;
    let visible = false;
    let activeCard: HTMLElement | null = null;

    const setActive = (el: HTMLElement | null) => {
      if (activeCard === el) return;
      if (activeCard) activeCard.classList.remove("is-loupe-active");
      activeCard = el;
      if (activeCard) activeCard.classList.add("is-loupe-active");
    };

    const showLoupe = () => {
      if (visible) return;
      visible = true;
      loupe.classList.add("is-visible");
      root.classList.add("is-loupe-on");
    };

    const hideLoupe = () => {
      if (!visible) return;
      visible = false;
      loupe.classList.remove("is-visible");
      root.classList.remove("is-loupe-on");
      setActive(null);
    };

    const tick = () => {
      raf = 0;
      loupe.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-loupe-target]");
      if (target) {
        showLoupe();
        setActive(target);
      } else {
        hideLoupe();
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => hideLoupe();

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (raf) cancelAnimationFrame(raf);
      setActive(null);
      loupe.classList.remove("is-visible");
      root.classList.remove("is-loupe-on");
    };
  }, [enabled, containerRef]);

  if (!enabled) return null;

  return (
    <div ref={loupeRef} className="loupe" aria-hidden="true">
      <div className="loupe-ring" />
      <div className="loupe-glint" />
      <div className="loupe-handle" />
    </div>
  );
}
