import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

/**
 * Animated dot-matrix background — a faint gold grid with an opacity wave
 * drifting across it. Fixed behind all content (.code-bg, z-index:-1).
 *
 * Canvas + requestAnimationFrame (not anime.js): a continuous particle field
 * is a raw-canvas job, not a tween. Under reduced motion / print the .code-bg
 * is hidden by the CSS kill-switch and the rAF loop never starts.
 */
export default function CodeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const gap = 34; // px between dots
    const rgb = "212, 168, 71"; // --primary
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = () => {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      for (let x = 0; x < w; x += gap) {
        for (let y = 0; y < h; y += gap) {
          const phase = Math.sin((x + y) * 0.012 + t);
          const a = 0.04 + Math.max(0, phase) * 0.13;
          ctx.fillStyle = `rgba(${rgb}, ${a.toFixed(3)})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="code-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
