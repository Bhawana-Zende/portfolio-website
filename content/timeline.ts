import { milestoneSchema, type Milestone } from "./schema";

/* CORRIDOR — RÉSUMÉ.
 * Reserved block. The real career and education entries go here when
 * they're ready to be public; this repository is public, so nothing is
 * seeded. Add entries in chronological order and set confirm: true for
 * anything still unverified. */

const entries: unknown[] = [
  {
    id: "milestone-placeholder",
    role: "[PLACEHOLDER] Role",
    place: "[PLACEHOLDER] Place",
    years: "0000–0000",
    line: "[PLACEHOLDER] One line about this milestone.",
    kind: "work",
    confirm: true,
  },
];

export const timeline: Milestone[] = entries.map((entry) =>
  milestoneSchema.parse(entry),
);
