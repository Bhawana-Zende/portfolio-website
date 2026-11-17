"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TICKET_SESSION_KEY } from "@/lib/theme";
import { useReducedMotion } from "@/lib/useReducedMotion";

const HOLD_MS = 1300;

function stampDate(): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();
}

/**
 * First-visit admission. Once per session, under 1.5s, skippable by any
 * key or click. It must never be the reason someone can't get in: if
 * anything about it fails, it resolves immediately.
 */
export function AdmissionTicket({ onAdmitted }: { onAdmitted: () => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [date, setDate] = useState("");
  const settled = useRef(false);
  const reduced = useReducedMotion();

  const admit = useCallback(() => {
    if (settled.current) return;
    settled.current = true;
    try {
      sessionStorage.setItem(TICKET_SESSION_KEY, "1");
    } catch {
      /* no session storage — the ticket simply shows again next visit */
    }
    setLeaving(true);
    window.setTimeout(onAdmitted, reduced ? 0 : 420);
  }, [onAdmitted, reduced]);

  useEffect(() => {
    let shown = false;
    try {
      shown = sessionStorage.getItem(TICKET_SESSION_KEY) === "1";
    } catch {
      shown = false;
    }

    if (shown) {
      settled.current = true;
      onAdmitted();
      return;
    }

    setDate(stampDate());
    setVisible(true);
    const timer = window.setTimeout(admit, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [admit, onAdmitted]);

  useEffect(() => {
    if (!visible) return;
    const skip = () => admit();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [visible, admit]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{
        background: "var(--color-ink)",
        opacity: leaving ? 0 : 1,
        transition: reduced ? "none" : "opacity 420ms cubic-bezier(0.4,0,0.2,1)",
      }}
      role="status"
      aria-label="Admission ticket"
    >
      <div
        className="relative px-9 py-8"
        style={{
          color: "var(--color-paper)",
          border: "1px solid var(--color-graphite)",
          borderRadius: "var(--radius-cards)",
          // perforated edge, torn from the roll
          maskImage:
            "radial-gradient(circle 4px at 0 50%, transparent 98%, #000 100%), radial-gradient(circle 4px at 100% 50%, transparent 98%, #000 100%)",
          maskComposite: "intersect",
          WebkitMaskImage:
            "radial-gradient(circle 4px at 0 50%, transparent 98%, #000 100%), radial-gradient(circle 4px at 100% 50%, transparent 98%, #000 100%)",
          animation: reduced
            ? "none"
            : "ticket-settle 700ms cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <p className="t-micro" style={{ color: "var(--color-ash)" }}>
          Admit one
        </p>
        <p
          className="t-heading-sm mt-[16px]"
        >
          The Museum
        </p>
        <p
          className="t-micro mt-[20px]"
          style={{ color: "var(--color-ash)" }}
        >
          {date}
        </p>
      </div>

      <style>{`
        @keyframes ticket-settle {
          from { opacity: 0; transform: translateY(10px) rotate(-0.6deg); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
