"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AdmissionTicket } from "./AdmissionTicket";
import { Inscription } from "./Inscription";
import { useReducedMotion } from "@/lib/useReducedMotion";

const BLACKOUT_MS = 1500;
const FAILSAFE_MS = 4000;

/**
 * The entrance, built on the system's hero: a small centred type cluster
 * over a wordmark set large enough to crop at the viewport edges. The
 * name should feel bigger than the screen — that's the whole gesture.
 *
 * The darkness is cleared by state and a timer, never by the animation
 * timeline, so a stalled ticker can't leave a visitor in a dark room.
 */
export function Foyer({
  name,
  hero,
  stats,
}: {
  name: string;
  hero: { top: string; connector: string; bottom: string };
  stats: { label: string; value: string }[];
}) {
  const root = useRef<HTMLElement>(null);
  const [admitted, setAdmitted] = useState(false);
  const [lit, setLit] = useState(false);
  const reduced = useReducedMotion();

  const onAdmitted = useCallback(() => setAdmitted(true), []);

  useEffect(() => {
    if (!admitted) return;
    const timer = window.setTimeout(
      () => setLit(true),
      reduced ? 0 : BLACKOUT_MS + 100,
    );
    return () => window.clearTimeout(timer);
  }, [admitted, reduced]);

  useEffect(() => {
    if (!admitted) return;
    const node = root.current;
    if (!node) return;

    const settle = () =>
      gsap.set(
        node.querySelectorAll(
          "[data-inscription-glyph],[data-foyer-rule],[data-foyer-fade]",
        ),
        { autoAlpha: 1, yPercent: 0, y: 0, scaleX: 1 },
      );

    if (reduced) {
      settle();
      return;
    }

    let failsafe = 0;
    let timeline: gsap.core.Timeline | null = null;

    const context = gsap.context(() => {
      timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => window.clearTimeout(failsafe),
      });

      timeline
        .from("[data-foyer-fade]", {
          autoAlpha: 0,
          y: 16,
          duration: 0.9,
          stagger: 0.14,
        })
        .from(
          "[data-inscription-glyph]",
          { yPercent: 106, duration: 1.3, stagger: 0.05 },
          "-=0.5",
        );

      // finish the timeline rather than set values underneath it: a
      // still-running tween would overwrite them on its next tick
      failsafe = window.setTimeout(() => {
        timeline?.progress(1).kill();
        settle();
      }, FAILSAFE_MS);
    }, node);

    return () => {
      window.clearTimeout(failsafe);
      context.revert();
    };
  }, [admitted, reduced]);

  function stepInside() {
    document
      .querySelector('[data-room="gallery-i"]')
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <>
      {!admitted ? <AdmissionTicket onAdmitted={onAdmitted} /> : null}

      {!lit ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40"
          style={{
            background: "var(--color-ink)",
            opacity: admitted ? 0 : 1,
            transition: reduced
              ? "none"
              : `opacity ${BLACKOUT_MS}ms cubic-bezier(0.37, 0, 0.63, 1)`,
          }}
        />
      ) : null}

      <section
        ref={root}
        id="foyer"
        data-room="foyer"
        data-tone="open"
        aria-label="Foyer"
        className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-[96px] pb-0"
      >
        {/* The hero is a putty canvas, but it stops short of the floor so
            the painting is already there behind the wordmark — the same
            landscape the rest of the building is built over. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0"
          style={{
            height: "calc(100% - var(--wordmark-h))",
            background: "var(--color-putty)",
          }}
        />
        {/* the small cluster: who, how much, and the way in */}
        <div
          className="relative flex flex-1 flex-col items-center justify-center px-5 text-center"
          style={{ color: "var(--color-ink)" }}
        >
          <p
            data-foyer-fade=""
            className="t-micro"
            style={{ color: "var(--color-graphite)" }}
          >
            The Museum
          </p>

          <p data-foyer-fade="" className="t-heading-lg mt-[20px]">
            {hero.top}
            <br />
            <em style={{ fontStyle: "italic" }}>{hero.connector}</em>{" "}
            {hero.bottom}
          </p>

          <div
            data-foyer-fade=""
            className="mt-[28px] flex flex-wrap items-center justify-center gap-x-[28px] gap-y-[8px]"
          >
            {stats.map((stat) => (
              <span key={stat.label} className="t-stat">
                {stat.label}: {stat.value}
              </span>
            ))}
          </div>

          <button
            data-foyer-fade=""
            type="button"
            onClick={stepInside}
            className="c-pill mt-[28px]"
            style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}
          >
            Enter the museum
          </button>
        </div>

        {/* the wordmark, cut off by both walls on purpose */}
        <div
          className="t-display-frame relative"
          style={{ color: "var(--color-paper)" }}
        >
          <Inscription text={name} />
        </div>
      </section>
    </>
  );
}
