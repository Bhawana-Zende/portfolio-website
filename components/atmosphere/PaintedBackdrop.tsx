"use client";

import { useEffect, useRef } from "react";
import { backdrop } from "@/content/backdrop";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The painting, fixed behind the whole building. Scrolling moves the
 * canvas slowly against the rooms, so the visitor travels through one
 * landscape rather than past a series of pictures.
 *
 * Opaque rooms cover it; open rooms reveal it. A flat scrim — never a
 * gradient — keeps type legible over the paint.
 */
export function PaintedBackdrop() {
  const canvas = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = canvas.current;
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
        const progress = Math.min(1, Math.max(0, window.scrollY / span));
        // the canvas is 128% tall: travel the extra 28% across the walk
        node.style.transform = `translate3d(0, ${-progress * 28}%, 0)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: "var(--color-ink)" }}
    >
      <div
        ref={canvas}
        className="absolute inset-x-0 top-0"
        style={{
          height: "128%",
          backgroundImage: `image-set(url("${backdrop.src}") 1x)`,
          backgroundSize: "cover",
          backgroundPosition: backdrop.focus,
          willChange: "transform",
        }}
      />
      {/* flat scrim, set per lighting mode */}
      <div
        className="absolute inset-0"
        style={{
          background: "var(--color-ink)",
          opacity: "var(--scrim)",
          transition: "opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}
