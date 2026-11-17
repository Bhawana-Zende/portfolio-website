"use client";

import { useRef, useState } from "react";
import { GenerativePiece } from "@/components/art/GenerativePiece";
import type { Exhibit } from "@/content/schema";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * A piece on a wall: mat, hairline frame, placard beneath.
 *
 * Hovering lights it — a spotlight that follows where the visitor is
 * looking — and eases the placard in. The whole thing is one button with
 * a descriptive label, so a keyboard visitor gets the same piece, lit the
 * same way, in the same order along the wall.
 */
export function Frame({
  exhibit,
  onOpen,
  ratio = 0.78,
  className = "",
  eager = false,
  index = 0,
}: {
  exhibit: Exhibit;
  onOpen: (slug: string) => void;
  ratio?: number;
  className?: string;
  eager?: boolean;
  index?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [lit, setLit] = useState(false);
  const reduced = useReducedMotion();

  function trackLight(event: React.PointerEvent<HTMLButtonElement>) {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
  }

  const isImage = !exhibit.coverImage.src.startsWith("generative:");

  return (
    <figure className={`group m-0 ${className}`}>
      <button
        ref={ref}
        type="button"
        data-exhibit={exhibit.slug}
        onClick={() => onOpen(exhibit.slug)}
        onPointerMove={trackLight}
        onPointerEnter={() => setLit(true)}
        onPointerLeave={() => setLit(false)}
        onFocus={() => setLit(true)}
        onBlur={() => setLit(false)}
        aria-label={`View exhibit: ${exhibit.title}, ${exhibit.year}`}
        className="relative block w-full overflow-hidden md:cursor-none"
        style={{
          // the pointer is only replaced where the "View" circle can follow it
          cursor: reduced ? "pointer" : undefined,
          // the mat around the piece, as a passe-partout
          padding: "clamp(0.75rem, 2vw, 1.5rem)",
          background: "var(--wall-recess)",
          border: "1px solid var(--hairline)",
          transition: reduced
            ? "none"
            : "transform 900ms cubic-bezier(0.22,1,0.36,1)",
          transform: lit && !reduced ? "translateY(-4px)" : "none",
        }}
      >
        <span
          className="relative block overflow-hidden"
          style={{ aspectRatio: String(ratio) }}
        >
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={exhibit.coverImage.src}
              alt={exhibit.coverImage.alt}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <GenerativePiece
              seed={exhibit.slug}
              ratio={ratio}
              index={index}
              className="h-full w-full"
            />
          )}

          {/* the spotlight, following the pointer across the piece */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: lit && !reduced ? 1 : 0,
              transition: "opacity 700ms cubic-bezier(0.4,0,0.2,1)",
              background:
                "radial-gradient(14rem 14rem at var(--spot-x, 50%) var(--spot-y, 50%), var(--light-core), transparent 70%)",
              mixBlendMode: "soft-light",
            }}
          />
        </span>

        {/* the "View" circle the cursor becomes over a piece */}
        <span
          aria-hidden="true"
          className="u-micro pointer-events-none absolute flex items-center justify-center rounded-full"
          style={{
            left: "var(--spot-x, 50%)",
            top: "var(--spot-y, 50%)",
            width: "4.5rem",
            height: "4.5rem",
            marginLeft: "-2.25rem",
            marginTop: "-2.25rem",
            border: "1px solid var(--hairline)",
            background: "var(--wall)",
            color: "var(--ink-muted)",
            opacity: lit && !reduced ? 1 : 0,
            transform: `scale(${lit && !reduced ? 1 : 0.6})`,
            transition:
              "opacity 400ms cubic-bezier(0.4,0,0.2,1), transform 400ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          View
        </span>
      </button>

      <figcaption
        className="mt-5"
        style={{
          opacity: lit ? 1 : 0.72,
          transform: lit && !reduced ? "translateY(0)" : "translateY(3px)",
          transition: reduced
            ? "none"
            : "opacity 600ms cubic-bezier(0.4,0,0.2,1), transform 600ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <p className="u-exhibit-title m-0" style={{ fontSize: "clamp(1.0625rem, 0.95rem + 0.5vw, 1.375rem)" }}>
          {exhibit.title}
        </p>
        <p className="u-micro m-0 mt-2" style={{ color: "var(--ink-faint)" }}>
          <span className="u-year">{exhibit.year}</span>
          {" · "}
          {exhibit.category}
          {" · "}
          {exhibit.role}
        </p>
        <p
          className="m-0 mt-3 max-w-[28rem]"
          style={{
            color: "var(--ink-muted)",
            fontSize: "var(--text-label)",
            letterSpacing: "0.01em",
            lineHeight: 1.6,
          }}
        >
          {exhibit.summary}
        </p>
      </figcaption>
    </figure>
  );
}
