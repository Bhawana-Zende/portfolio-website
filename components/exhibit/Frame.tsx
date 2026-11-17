"use client";

import { useState } from "react";
import { GenerativePiece } from "@/components/art/GenerativePiece";
import type { Exhibit } from "@/content/schema";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * A piece on a wall: a Bone card at the 9px card radius, an Ash image
 * container, and a wall label beneath.
 *
 * The system is flat — no shadows, no gradients — so reaching for a
 * piece is shown by the frame taking full contrast and the View pill
 * arriving, not by a spotlight or a lift.
 */
export function Frame({
  exhibit,
  onOpen,
  ratio = 0.78,
  className = "",
  eager = false,
  index = 0,
  shape = "rect",
}: {
  exhibit: Exhibit;
  onOpen: (slug: string) => void;
  ratio?: number;
  className?: string;
  eager?: boolean;
  index?: number;
  /** The circle is the system's image shape after the full-bleed rectangle. */
  shape?: "rect" | "circle";
}) {
  const [near, setNear] = useState(false);
  const reduced = useReducedMotion();
  const isImage = !exhibit.coverImage.src.startsWith("generative:");
  const circular = shape === "circle";

  return (
    <figure className={`m-0 ${className}`}>
      <button
        type="button"
        data-exhibit={exhibit.slug}
        onClick={() => onOpen(exhibit.slug)}
        onPointerEnter={() => setNear(true)}
        onPointerLeave={() => setNear(false)}
        onFocus={() => setNear(true)}
        onBlur={() => setNear(false)}
        aria-label={`View exhibit: ${exhibit.title}, ${exhibit.year}`}
        className="relative block w-full cursor-pointer text-left"
        style={{
          padding: circular ? 0 : "var(--card-padding)",
          background: circular ? "transparent" : "var(--room-card)",
          border: circular ? "0" : `1px solid ${near ? "currentColor" : "var(--room-rule)"}`,
          borderRadius: circular ? "50%" : "var(--radius-cards)",
          transition: reduced ? "none" : "border-color 400ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <span
          className="relative block overflow-hidden"
          style={{
            aspectRatio: circular ? "1" : String(ratio),
            borderRadius: circular ? "50%" : "var(--radius-sm)",
            background: "var(--room-placeholder)",
          }}
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
              ratio={circular ? 1 : ratio}
              index={index}
              className="h-full w-full object-cover"
            />
          )}
        </span>

        {/* the one filled control, arriving when you reach for the piece */}
        <span
          aria-hidden="true"
          className="c-pill absolute"
          style={{
            right: circular ? "50%" : "var(--card-padding)",
            bottom: circular ? "-18px" : "var(--card-padding)",
            transform: circular ? "translateX(50%)" : "none",
            opacity: near ? 1 : 0,
            transition: reduced ? "none" : "opacity 320ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          View
        </span>
      </button>

      <figcaption className={circular ? "mt-[28px] text-center" : "mt-[20px]"}>
        <p className="t-caption">{exhibit.title}</p>
        <p className="t-micro mt-[8px]" style={{ color: "var(--room-muted)" }}>
          {exhibit.year} · {exhibit.category} · {exhibit.role}
        </p>
        <p
          className="t-body mt-[12px] max-w-[42ch]"
          style={{ opacity: 0.78, fontSize: "var(--text-body-sm)" }}
        >
          {exhibit.summary}
        </p>
      </figcaption>
    </figure>
  );
}
