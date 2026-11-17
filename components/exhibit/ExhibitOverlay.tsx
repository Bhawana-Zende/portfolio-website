"use client";

import { useEffect, useRef } from "react";
import { ExhibitDetail } from "./ExhibitDetail";
import { exhibitBySlug } from "@/lib/museum";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Stepping closer. The museum dims behind, the piece fills the view, and
 * Esc or the back button steps back to exactly where the visitor was
 * standing — with focus returned to the piece they left.
 */
export function ExhibitOverlay({
  slug,
  onClose,
  onNavigate,
}: {
  slug: string;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const exhibit = exhibitBySlug(slug);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  // focus moves into the detail view when it opens
  useEffect(() => {
    panel.current?.focus();
    panel.current?.scrollTo({ top: 0 });
  }, [slug]);

  if (!exhibit) return null;

  return (
    <div
      className="fixed inset-0 z-[65]"
      role="dialog"
      aria-modal="true"
      aria-label={`Exhibit: ${exhibit.title}`}
    >
      <button
        type="button"
        aria-label="Step back to the museum"
        onClick={onClose}
        className="absolute inset-0 h-full w-full"
        style={{
          background: "color-mix(in srgb, var(--wall) 82%, transparent)",
          backdropFilter: "blur(14px)",
          animation: reduced ? "none" : "dim-in 500ms ease both",
        }}
      />

      <div
        ref={panel}
        tabIndex={-1}
        className="relative h-full w-full overflow-y-auto outline-none"
        style={{
          background: "var(--wall)",
          animation: reduced
            ? "none"
            : "step-closer 620ms cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <div className="sticky top-0 z-10 flex justify-end px-6 py-5 sm:px-10">
          <button
            type="button"
            onClick={onClose}
            className="u-label flex items-center gap-3 px-4 py-2"
            style={{
              color: "var(--ink-muted)",
              background: "var(--wall)",
              border: "1px solid var(--hairline)",
            }}
          >
            Step back
          </button>
        </div>

        <ExhibitDetail exhibit={exhibit} onNavigate={onNavigate} />
      </div>

      <style>{`
        @keyframes dim-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes step-closer {
          from { opacity: 0; transform: scale(1.03) }
          to   { opacity: 1; transform: none }
        }
      `}</style>
    </div>
  );
}
