import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";

interface TypewriterProps {
  text: string;
  /** Per-character delay (ms). */
  speed?: number;
  /** Delay before typing starts (ms). */
  startDelay?: number;
  className?: string;
}

/**
 * Terminal-style typing effect with a blinking cursor.
 *
 * Pure React (no anime.js needed — it's a discrete character timer). Under
 * reduced motion the full text renders immediately with the cursor settled.
 */
export default function Typewriter({
  text,
  speed = 55,
  startDelay = 350,
  className,
}: TypewriterProps) {
  const reduced = prefersReducedMotion();
  const [shown, setShown] = useState(reduced ? text : "");
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(text);
      setDone(true);
      return;
    }

    setShown("");
    setDone(false);
    let i = 0;
    let tickTimer: ReturnType<typeof setTimeout>;

    const startTimer = setTimeout(function tick() {
      i++;
      setShown(text.slice(0, i));
      if (i < text.length) {
        tickTimer = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(tickTimer);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {shown}
      <span className="tw-cursor" data-done={done} aria-hidden="true">
        ▌
      </span>
    </span>
  );
}
