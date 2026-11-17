"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AdmissionTicket } from "./AdmissionTicket";
import { Inscription } from "./Inscription";
import { useReducedMotion } from "@/lib/useReducedMotion";

const BLACKOUT_MS = 1500;
/** If the animation engine never ticks, the room lights itself anyway. */
const FAILSAFE_MS = 4000;

/**
 * The entrance. The room is dark, the lights come up, and the name is
 * lifted through its masks before anything else is readable.
 *
 * The darkness is cleared by state and a timer, never by the animation
 * timeline: a stalled ticker — a background tab, a dropped frame budget,
 * a GSAP failure — must not be able to leave a visitor in a dark room.
 */
export function Foyer({ name, intro }: { name: string; intro: string }) {
  const root = useRef<HTMLElement>(null);
  const [admitted, setAdmitted] = useState(false);
  const [lit, setLit] = useState(false);
  const reduced = useReducedMotion();

  const onAdmitted = useCallback(() => setAdmitted(true), []);

  // the blackout always comes down, on a plain timer
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

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => window.clearTimeout(failsafe),
      });

      timeline
        .from("[data-inscription-glyph]", {
          yPercent: 108,
          duration: 1.25,
          stagger: 0.055,
        })
        .from(
          "[data-foyer-rule]",
          { scaleX: 0, duration: 1.1, ease: "power2.inOut" },
          "-=0.55",
        )
        .from(
          "[data-foyer-fade]",
          { autoAlpha: 0, y: 14, duration: 1, stagger: 0.18 },
          "-=0.75",
        );

      // if the timeline hasn't finished by now, show everything outright
      failsafe = window.setTimeout(settle, FAILSAFE_MS);
    }, node);

    return () => {
      window.clearTimeout(failsafe);
      context.revert();
    };
  }, [admitted, reduced]);

  function stepInside() {
    const threshold = document.getElementById("threshold");
    if (!threshold) return;
    threshold.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <>
      {!admitted ? <AdmissionTicket onAdmitted={onAdmitted} /> : null}

      {/* darkness: faded by CSS, removed by a timer */}
      {!lit ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40"
          style={{
            background: "#0b0a09",
            opacity: admitted ? 0 : 1,
            transition: reduced
              ? "none"
              : `opacity ${BLACKOUT_MS}ms cubic-bezier(0.37, 0, 0.63, 1)`,
          }}
        />
      ) : null}

      <section
        ref={root}
        aria-label="Foyer"
        className="relative flex min-h-[100svh] flex-col justify-between px-6 pt-28 pb-10 sm:px-10 lg:px-16"
      >
        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <p
            data-foyer-fade=""
            className="u-micro m-0 mb-10"
            style={{ color: "var(--ink-faint)" }}
          >
            Foyer
          </p>

          <Inscription text={name} />

          <hr
            data-foyer-rule=""
            className="u-hairline my-9 w-full max-w-[34rem] origin-left"
          />

          <p
            data-foyer-fade=""
            className="u-lede m-0 max-w-[32rem]"
            style={{ color: "var(--ink-muted)" }}
          >
            {intro}
          </p>
        </div>

        <div
          data-foyer-fade=""
          className="relative z-10 flex items-end justify-between gap-6"
        >
          <button
            type="button"
            onClick={stepInside}
            className="group flex items-center gap-4 py-2"
          >
            <span
              aria-hidden="true"
              className="room-surface block h-10 w-px transition-[height] duration-700 group-hover:h-16"
              style={{ background: "var(--ink-faint)" }}
            />
            <span className="u-label" style={{ color: "var(--ink-muted)" }}>
              Enter
            </span>
          </button>

          <p
            className="u-micro m-0 hidden text-right sm:block"
            style={{ color: "var(--ink-faint)" }}
          >
            Scroll to walk in
          </p>
        </div>
      </section>
    </>
  );
}
