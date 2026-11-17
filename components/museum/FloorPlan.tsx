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

/** The system's secondary geometry: outline by default, filled for here. */
function Hexagon({
  cx,
  cy,
  r,
  filled = false,
}: {
  cx: number;
  cy: number;
  r: number;
  filled?: boolean;
}) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  return (
    <polygon
      points={points}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={0.6}
    />
  );
}

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
        className="c-pill fixed bottom-5 left-5 z-[60] sm:bottom-7 sm:left-7"
      >
        {open ? "Close plan" : "Floor plan"}
      </button>

      <div
        id="floor-plan"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 z-[59] sm:inset-auto sm:bottom-20 sm:left-7 sm:w-[32rem]"
        data-tone="light"
        style={{
          border: "1px solid var(--room-rule)",
          borderRadius: "var(--radius-cards)",
          animation: open ? "plan-in 420ms cubic-bezier(0.22,1,0.36,1) both" : "none",
        }}
      >
        <div className="p-6 sm:p-7">
          <p className="t-micro mb-[20px]" style={{ color: "var(--room-muted)" }}>
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
                    fill={isHere ? "currentColor" : "transparent"}
                    fillOpacity={isHere ? 0.1 : 0}
                    stroke="currentColor"
                    strokeOpacity={isHere ? 0.8 : 0.3}
                    strokeWidth={0.6}
                  />
                  <text
                    x={box.x + 3}
                    y={box.y + 8}
                    fill="currentColor"
                    fillOpacity={0.75}
                    style={{ font: "500 4px var(--font-helvetica-now)", letterSpacing: "0.3px" }}
                  >
                    {ROOM_META[room].label}
                  </text>
                </g>
              );
            })}

            {/* you are here — the hexagon is the system's indicator shape */}
            <Hexagon
              cx={here.x + here.w / 2}
              cy={here.y + here.h / 2}
              r={3.2}
              filled
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
                  className="t-label flex w-full items-center gap-[8px] py-2 text-left"
                  style={{ opacity: room === current ? 1 : 0.6 }}
                >
                  <svg viewBox="0 0 10 10" className="h-[10px] w-[10px]" aria-hidden="true">
                    <Hexagon cx={5} cy={5} r={4} filled={room === current} />
                  </svg>
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
