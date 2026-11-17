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
            style={{ background: "var(--hairline)" }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 h-2 w-px"
            style={{ background: "var(--accent)", transform: "translateY(-3px)" }}
          />
          <p className="u-micro m-0" style={{ color: "var(--ink-faint)" }}>
            <span className="u-year">{milestone.years}</span>
            {milestone.confirm ? " · to confirm" : null}
          </p>
          <p className="u-exhibit-title m-0 mt-3" style={{ fontSize: "1.25rem" }}>
            {milestone.role}
          </p>
          <p className="u-label m-0 mt-2" style={{ color: "var(--accent)" }}>
            {milestone.place}
          </p>
          <p
            className="m-0 mt-4 max-w-[22rem]"
            style={{ color: "var(--ink-muted)", fontSize: "var(--text-label)", lineHeight: 1.65 }}
          >
            {milestone.line}
          </p>
        </li>
      ))}
    </ol>
  );
}
