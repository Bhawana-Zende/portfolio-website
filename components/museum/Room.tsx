"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROOM_META } from "@/lib/museum";
import type { Room as RoomId } from "@/content/schema";
import { useReducedMotion } from "@/lib/useReducedMotion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * A room. Entering one is a doorway: the frame overhead slides past at a
 * different rate from the wall behind it, so the visitor reads depth
 * rather than a section boundary.
 */
export function Room({
  id,
  children,
  wide = false,
}: {
  id: RoomId;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const meta = ROOM_META[id];

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    const context = gsap.context(() => {
      // the doorway header drifts against the wall as you walk through
      gsap.to("[data-doorway]", {
        yPercent: 28,
        ease: "none",
        scrollTrigger: {
          trigger: node,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from("[data-room-heading] > *", {
        yPercent: 60,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: node, start: "top 72%", once: true },
        onComplete: () => window.clearTimeout(failsafe),
      });
    }, node);

    // a heading that never got its trigger must still be readable
    const failsafe = window.setTimeout(() => {
      gsap.set(node.querySelectorAll("[data-room-heading] > *"), {
        autoAlpha: 1,
        yPercent: 0,
      });
    }, 6000);

    return () => {
      window.clearTimeout(failsafe);
      context.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      data-room={id}
      className="relative scroll-mt-0 px-6 py-[var(--spacing-room)] sm:px-10 lg:px-16"
    >
      {/* the doorway: a lintel line the visitor passes under */}
      <div
        data-doorway=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--hairline)" }}
      />

      <header
        data-room-heading=""
        className={`mb-[clamp(3rem,6vw,6rem)] ${wide ? "" : "max-w-[70rem]"}`}
      >
        <div className="overflow-hidden">
          <p className="u-micro m-0" style={{ color: "var(--accent)" }}>
            {meta.label}
          </p>
        </div>
        <div className="mt-4 overflow-hidden">
          <h2 id={`${id}-title`} className="u-room-title m-0">
            {meta.name}
          </h2>
        </div>
        <div className="mt-6 overflow-hidden">
          <p
            className="u-lede m-0 max-w-[30rem]"
            style={{ color: "var(--ink-muted)" }}
          >
            {meta.note}
          </p>
        </div>
      </header>

      {children}
    </section>
  );
}
