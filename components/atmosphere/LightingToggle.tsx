"use client";

import { useEffect, useState } from "react";
import { applyLighting, readLighting, type Lighting } from "@/lib/theme";

/**
 * A dial, not a switch list. The disc is eclipsed to become a moon and
 * the whole dial turns half a revolution, over the same 1.2s the room
 * takes to dim — the control and the lights move together.
 */
export function LightingToggle() {
  const [lighting, setLighting] = useState<Lighting>("daylight");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLighting(readLighting());
    setMounted(true);
  }, []);

  const isEvening = lighting === "evening";
  const next: Lighting = isEvening ? "daylight" : "evening";

  function toggle() {
    applyLighting(next);
    setLighting(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        isEvening ? "Turn on daylight lighting" : "Turn on evening lighting"
      }
      className="group relative flex h-11 w-11 items-center justify-center rounded-full"
      // the dial shouldn't animate into position on first paint
      style={{ visibility: mounted ? "visible" : "hidden" }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border opacity-50 group-hover:opacity-100"
        style={{ borderColor: "currentColor" }}
      />
      <svg
        viewBox="0 0 32 32"
        className="relative h-5 w-5"
        aria-hidden="true"
        style={{
          transform: `rotate(${isEvening ? 180 : 0}deg)`,
          transition: "transform 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <defs>
          <mask id="eclipse">
            <rect width="32" height="32" fill="#fff" />
            <circle
              cx="16"
              cy="16"
              r="10"
              fill="#000"
              style={{
                transform: `translateX(${isEvening ? -8 : -26}px)`,
                transition: "transform 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </mask>
        </defs>
        <circle
          cx="16"
          cy="16"
          r="9"
          fill="currentColor"
          mask="url(#eclipse)"
        />
      </svg>
    </button>
  );
}
