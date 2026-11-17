import { z } from "zod";

/* ───────────────────────────────────────────────────────────────
   Every wall in the museum is described here. Adding content means
   editing these files — never the components. See CONTENT.md.
   ─────────────────────────────────────────────────────────────── */

export const ROOMS = [
  "foyer",
  "gallery-i",
  "gallery-ii",
  "gallery-iii",
  "gallery-iv",
  "corridor",
  "exit",
] as const;

export const roomSchema = z.enum(ROOMS);
export type Room = z.infer<typeof roomSchema>;

/**
 * An image on a wall. `alt` is required and must say something — the
 * validator rejects empty or placeholder-only alt text, because an
 * unlabelled image is an exhibit no one can see.
 *
 * `src` is either a file in /public (e.g. "/exhibits/gewe/cover.jpg")
 * or "generative:<name>", which asks the museum to draw the piece.
 */
export const museumImageSchema = z.object({
  src: z
    .string()
    .min(1, "image src is required")
    .refine(
      (value) => value.startsWith("/") || value.startsWith("generative:"),
      "src must be a /public path or a generative:<name> token",
    ),
  alt: z.string().min(8, "alt text must describe the image"),
  caption: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type MuseumImage = z.infer<typeof museumImageSchema>;

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  kind: z.enum(["live", "article", "video", "github", "press", "other"]),
});
export type MuseumLink = z.infer<typeof linkSchema>;

/** The story on a placard's long form: problem, what was made, why it matters. */
export const storySchema = z.object({
  problem: z.string().min(1),
  built: z.string().min(1),
  matters: z.string().min(1),
});

export const exhibitSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers and dashes"),
  title: z.string().min(1),
  year: z.string().min(4),
  category: z.string().min(1),
  role: z.string().min(1),
  room: roomSchema,
  status: z.enum(["active", "shipped", "archived", "in-progress"]),
  coverImage: museumImageSchema,
  summary: z.string().min(1),
  story: storySchema,
  gallery: z.array(museumImageSchema),
  links: z.array(linkSchema),
  outcomes: z.array(z.string()).default([]),
  placeholder: z.boolean().default(false),
});
export type Exhibit = z.infer<typeof exhibitSchema>;

export const artworkSchema = exhibitSchema.extend({
  medium: z.string().min(1),
  note: z.string().min(1),
});
export type Artwork = z.infer<typeof artworkSchema>;

export const ARTICLE_THEMES = [
  "AI",
  "Healthcare",
  "Founder Life",
  "Personal",
] as const;

export const articleSchema = exhibitSchema.extend({
  theme: z.enum(ARTICLE_THEMES),
  excerpt: z.string().min(1),
  readingMinutes: z.number().int().positive(),
  sourceUrl: z.string().optional(),
});
export type Article = z.infer<typeof articleSchema>;

export const bookSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  author: z.string().min(1),
  year: z.string().optional(),
  spineColor: z.string().optional(),
  notes: z.string().optional(),
  passages: z.array(z.string()).optional(),
  /**
   * Hides the entry from the site. It does NOT hide it from the public
   * repo — private notes belong outside this repository.
   */
  private: z.boolean().default(false),
});
export type Book = z.infer<typeof bookSchema>;

export const milestoneSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  place: z.string().min(1),
  years: z.string().min(1),
  line: z.string().min(1),
  kind: z.enum(["work", "education"]),
  /** Set while a date, title or detail still needs checking. */
  confirm: z.boolean().default(false),
});
export type Milestone = z.infer<typeof milestoneSchema>;
