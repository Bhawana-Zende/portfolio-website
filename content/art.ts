import { artworkSchema, type Artwork } from "./schema";

/* GALLERY III — ART. Placeholders drawn by the museum until real files land. */

const entries: unknown[] = [1, 2, 3, 4].map((n) => ({
  id: `artwork-${n}`,
  slug: `artwork-${n}`,
  title: `Untitled ${n}`,
  year: "2026",
  category: "Art",
  role: "Artist",
  room: "gallery-iii",
  status: "shipped",
  medium: "[PLACEHOLDER] Medium",
  note: "[PLACEHOLDER] A short note about this piece.",
  coverImage: {
    src: `generative:artwork-${n}`,
    alt: `Generative composition standing in for artwork number ${n}`,
  },
  summary: "[PLACEHOLDER] One-line note to be written.",
  story: {
    problem: "[PLACEHOLDER]",
    built: "[PLACEHOLDER]",
    matters: "[PLACEHOLDER]",
  },
  gallery: [],
  links: [],
  outcomes: [],
  placeholder: true,
}));

export const artworks: Artwork[] = entries.map((entry) =>
  artworkSchema.parse(entry),
);
