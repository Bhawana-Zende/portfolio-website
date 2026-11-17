"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROOM_META } from "@/lib/museum";
import type { Room as RoomId } from "@/content/schema";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Wireframe } from "@/components/atmosphere/Wireframe";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * A room. Entering one is a doorway: the frame overhead slides past at a
 * different rate from the wall behind it, so the visitor reads depth
 * rather than a section boundary.
 */
export function Room({
  id,
  tone,
  children,
  wide = false,
  wireframe,
}: {
  id: RoomId;
  /** Rooms alternate light and dark with hard cuts — never a gradient. */
  tone: "light" | "dark" | "open";
  children: React.ReactNode;
  wide?: boolean;
  /** Hairline geometry over a dark room. */
  wireframe?: "chevron" | "diamond" | "corners";
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const meta = ROOM_META[id];

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    let heading: gsap.core.Tween | null = null;

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

      heading = gsap.from("[data-room-heading] > *", {
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
      heading?.progress(1).kill();
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
      data-tone={tone}
      className="relative overflow-hidden px-5 py-[var(--spacing-96)] sm:px-7 lg:px-[var(--spacing-40)]"
    >
      {wireframe ? <Wireframe variant={wireframe} /> : null}

      {/* the doorway: a lintel line the visitor passes under */}
      <div
        data-doorway=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--room-rule)" }}
      />

      <header
        data-room-heading=""
        /* the heading sits above the wireframe */
        style={{ position: "relative", zIndex: 1 }}
        className={`mb-[var(--spacing-60)] ${wide ? "" : "max-w-[70rem]"}`}
      >
        <div className="overflow-hidden">
          <p className="t-micro" style={{ color: "var(--room-muted)" }}>
            {meta.label}
          </p>
        </div>
        <div className="mt-[16px] overflow-hidden">
          <h2 id={`${id}-title`} className="t-section">
            {meta.name}
          </h2>
        </div>
        <div className="mt-[20px] overflow-hidden">
          <p className="t-caption max-w-[34ch]" style={{ opacity: 0.72 }}>
            {meta.note}
          </p>
        </div>
      </header>

      <div className="relative z-[1]">{children}</div>
    </section>
  );
}
