import type { Milestone } from "@/content/schema";

/** The corridor: placards along a wall, one per year you walked past. */
export function Milestones({ milestones }: { milestones: Milestone[] }) {
  return (
    <ol className="m-0 flex list-none gap-0 overflow-x-auto p-0">
      {milestones.map((milestone) => (
        <li
          key={milestone.id}
          className="relative m-0 shrink-0 pr-[clamp(2rem,5vw,5rem)]"
          style={{ minWidth: "min(20rem, 72vw)" }}
        >
          <div
            aria-hidden="true"
            className="mb-7 h-px w-full"
            style={{ background: "var(--room-rule)" }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 h-2 w-px"
            style={{ background: "var(--room-fg)", transform: "translateY(-3px)" }}
          />
          <p className="t-micro" style={{ color: "var(--room-muted)" }}>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{milestone.years}</span>
            {milestone.confirm ? " · to confirm" : null}
          </p>
          <p className="t-caption mt-[12px]">
            {milestone.role}
          </p>
          <p className="t-micro mt-[8px]" style={{ color: "var(--room-muted)" }}>
            {milestone.place}
          </p>
          <p
            className="t-body mt-[16px] max-w-[34ch]"
            style={{ opacity: 0.78, fontSize: "var(--text-body-sm)" }}
          >
            {milestone.line}
          </p>
        </li>
      ))}
    </ol>
  );
}
