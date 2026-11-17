"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * A long wall, walked rather than scrolled. The section pins and the wall
 * travels sideways under the visitor.
 *
 * On a phone, and whenever motion is reduced, it becomes an ordinary
 * swipeable row — the same pieces, no pinning, no hijacked scroll.
 */
export function LongWall({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = outer.current;
    const rail = track.current;
    if (!section || !rail) return;

    const query = window.matchMedia("(min-width: 768px)");
    if (reduced || !query.matches) return;

    const context = gsap.context(() => {
      const distance = () => rail.scrollWidth - window.innerWidth + 96;

      gsap.to(rail, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => context.revert();
  }, [reduced]);

  return (
    // the wall is wider than the room; the room must not scroll sideways
    <div ref={outer} className="relative overflow-hidden">
      <div
        ref={track}
        className="flex gap-[clamp(1.5rem,4vw,4rem)] overflow-x-auto pb-6 md:overflow-visible"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {children}
      </div>
    </div>
  );
}
