import { articleSchema, type Article } from "./schema";

/* GALLERY II — WRITING.
 * Reserved block. Real pieces arrive as MDX in content/articles/ via the
 * Medium import script (step 4); these placeholders only prove the wall. */

const entries: unknown[] = [
  { n: 1, theme: "AI" },
  { n: 2, theme: "Healthcare" },
  { n: 3, theme: "Founder Life" },
  { n: 4, theme: "Personal" },
].map(({ n, theme }) => ({
  id: `article-${n}`,
  slug: `untitled-piece-${n}`,
  title: `Untitled Piece ${n}`,
  year: "2026",
  category: "Writing",
  role: "Author",
  room: "gallery-ii",
  status: "shipped",
  theme,
  readingMinutes: 5,
  excerpt: "[PLACEHOLDER] An excerpt from the piece.",
  coverImage: {
    src: `generative:article-${n}`,
    alt: `Generative composition standing in for article number ${n}`,
  },
  summary: "[PLACEHOLDER] One-line curatorial description to be written.",
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

export const articles: Article[] = entries.map((entry) =>
  articleSchema.parse(entry),
);
