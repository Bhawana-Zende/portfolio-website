"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The museum's single light source. Everything else in the design is
 * colourless: this is what makes a wall read as lit rather than filled.
 * Daylight puts it high and to the left, like a window; evening pulls it
 * down and tightens it, like a ceiling spot.
 */
export function RoomLight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const span = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const progress = Math.min(1, window.scrollY / span);
        // the sun crosses the window as the visitor walks the building
        node.style.setProperty("--drift-x", `${progress * 16}%`);
        node.style.setProperty("--drift-y", `${progress * 9}%`);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-room-light=""
      className="room-surface pointer-events-none fixed inset-0 z-0"
      style={
        {
          "--drift-x": "0%",
          "--drift-y": "0%",
          opacity: "var(--light-strength)",
          backgroundImage:
            "radial-gradient(var(--light-size) var(--light-size) at calc(26% + var(--drift-x)) calc(14% + var(--drift-y)), var(--light-core), var(--light-falloff) 70%)",
        } as React.CSSProperties
      }
    />
  );
}
