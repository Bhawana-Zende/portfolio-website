"use client";

import { useState } from "react";
import { rng, seedFrom, between } from "@/lib/seed";
import type { Book } from "@/content/schema";

/** A spine, pulled forward when you reach for it. */
function Spine({ book }: { book: Book }) {
  const [out, setOut] = useState(false);
  const r = rng(seedFrom(book.slug));
  const width = between(r, 2.4, 4.4);
  const height = between(r, 82, 100);
  const tilt = between(r, -0.6, 0.6);
  // unset spines take a deterministic tint, so a shelf reads as many books
  const tint = book.spineColor
    ?? `color-mix(in srgb, var(--color-bone) ${Math.round(between(r, 62, 95))}%, var(--color-${r() > 0.6 ? "graphite" : "ash"}))`;
  const hasNotes = Boolean(book.notes || book.passages?.length);

  return (
    <div className="flex items-end" style={{ height: "clamp(14rem, 26vw, 22rem)" }}>
      <button
        type="button"
        onPointerEnter={() => setOut(true)}
        onPointerLeave={() => setOut(false)}
        onFocus={() => setOut(true)}
        onBlur={() => setOut(false)}
        aria-label={`${book.title} by ${book.author}${hasNotes ? ", with notes" : ""}`}
        className="relative flex items-end justify-center"
        style={{
          width: `${width}rem`,
          height: `${height}%`,
          background: tint,
          border: "1px solid var(--room-rule)",
          borderBottom: "none",
          transform: `translateY(${out ? -14 : 0}px) rotate(${out ? 0 : tilt}deg)`,
          transition: "transform 650ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <span
          className="t-micro absolute whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            bottom: "1.25rem",
            color: "var(--color-ink)",
            letterSpacing: "0.16em",
          }}
        >
          {book.title}
        </span>
        <span
          aria-hidden="true"
          className="absolute top-3 block h-px"
          style={{ width: "60%", background: "var(--color-ink)", opacity: out ? 0.75 : 0.2 }}
        />
      </button>
    </div>
  );
}

export function Shelf({ books }: { books: Book[] }) {
  return (
    <div>
      <div className="flex items-end gap-2 overflow-x-auto pb-0">
        {books.map((book) => (
          <Spine key={book.slug} book={book} />
        ))}
      </div>
      {/* the shelf itself */}
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{ background: "var(--room-fg)", opacity: 0.4 }}
      />
      <ul className="m-0 mt-8 grid list-none gap-x-10 gap-y-3 p-0 sm:grid-cols-2">
        {books.map((book) => (
          <li key={book.slug} className="m-0">
            <span className="t-body" style={{ fontFamily: "var(--font-davinci)", fontSize: "16px" }}>
              {book.title}
            </span>
            <span className="t-micro ml-3" style={{ color: "var(--room-muted)" }}>
              {book.author}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
