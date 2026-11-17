"use client";

import { useEffect, useState } from "react";
import { ROOM_META } from "@/lib/museum";
import { ROOMS, type Room } from "@/content/schema";

/**
 * The building, drawn as a plan. Rooms are sized by how much hangs in
 * them, not laid out as equal boxes — the plan tells you where the weight
 * of the work is before you walk anywhere.
 */
const PLAN: Record<Room, { x: number; y: number; w: number; h: number }> = {
  foyer: { x: 4, y: 58, w: 44, h: 38 },
  "gallery-i": { x: 4, y: 4, w: 60, h: 50 },
  "gallery-ii": { x: 68, y: 4, w: 48, h: 30 },
  "gallery-iii": { x: 68, y: 38, w: 78, h: 28 },
  "gallery-iv": { x: 52, y: 70, w: 40, h: 26 },
  corridor: { x: 96, y: 70, w: 50, h: 12 },
  exit: { x: 120, y: 4, w: 26, h: 30 },
};

export function FloorPlan({
  current,
  onWalk,
}: {
  current: Room;
  onWalk: (room: Room) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing =
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(event.target.tagName);
      if (typing) return;

      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (event.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;

      event.preventDefault();
      const index = ROOMS.indexOf(current);
      const step = event.key === "ArrowRight" ? 1 : -1;
      const target = ROOMS[Math.min(ROOMS.length - 1, Math.max(0, index + step))];
      if (target !== current) onWalk(target);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, onWalk, open]);

  const here = PLAN[current];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="floor-plan"
        className="u-micro fixed bottom-5 left-5 z-[60] flex items-center gap-3 px-4 py-3 sm:bottom-7 sm:left-7"
        style={{
          color: "var(--ink-muted)",
          background: "var(--wall)",
          border: "1px solid var(--hairline)",
        }}
      >
        <span
          aria-hidden="true"
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--accent)" }}
        />
        {open ? "Close" : "Map"}
      </button>

      <div
        id="floor-plan"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 z-[59] sm:inset-auto sm:bottom-20 sm:left-7 sm:w-[32rem]"
        style={{
          background: "var(--wall)",
          border: "1px solid var(--hairline)",
          animation: open ? "plan-in 420ms cubic-bezier(0.22,1,0.36,1) both" : "none",
        }}
      >
        <div className="p-6 sm:p-7">
          <p className="u-micro m-0 mb-5" style={{ color: "var(--ink-faint)" }}>
            Floor plan · press M
          </p>

          <svg
            viewBox="0 0 150 100"
            className="w-full"
            role="img"
            aria-label="Floor plan of the museum"
          >
            {ROOMS.map((room) => {
              const box = PLAN[room];
              const isHere = room === current;
              return (
                <g key={room}>
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.w}
                    height={box.h}
                    fill={isHere ? "var(--accent)" : "transparent"}
                    fillOpacity={isHere ? 0.08 : 0}
                    stroke="var(--ink)"
                    strokeOpacity={isHere ? 0.55 : 0.28}
                    strokeWidth={0.6}
                  />
                  <text
                    x={box.x + 3}
                    y={box.y + 8}
                    fill="var(--ink-muted)"
                    style={{ font: "500 4px var(--font-inter), sans-serif", letterSpacing: "0.3px" }}
                  >
                    {ROOM_META[room].label}
                  </text>
                </g>
              );
            })}

            {/* you are here */}
            <circle
              cx={here.x + here.w / 2}
              cy={here.y + here.h / 2}
              r={2.4}
              fill="var(--accent)"
            />
            <circle
              cx={here.x + here.w / 2}
              cy={here.y + here.h / 2}
              r={5}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={0.5}
              opacity={0.5}
            />
          </svg>

          <ul className="m-0 mt-6 grid list-none grid-cols-2 gap-x-6 gap-y-1 p-0">
            {ROOMS.map((room) => (
              <li key={room} className="m-0">
                <button
                  type="button"
                  onClick={() => {
                    onWalk(room);
                    setOpen(false);
                  }}
                  aria-current={room === current ? "true" : undefined}
                  className="u-label w-full py-2 text-left"
                  style={{
                    color: room === current ? "var(--accent)" : "var(--ink-muted)",
                  }}
                >
                  {ROOM_META[room].label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <style>{`
          @keyframes plan-in {
            from { opacity: 0; transform: translateY(12px) }
            to   { opacity: 1; transform: none }
          }
        `}</style>
      </div>
    </>
  );
}
