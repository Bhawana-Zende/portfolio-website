import { exhibitSchema, type Exhibit } from "./schema";

/* GALLERY I — WORK & VENTURES
 * Placeholders only. Replace `summary`, `story` and `outcomes`, then set
 * placeholder: false. See CONTENT.md for how to swap in a real image. */

const entries: unknown[] = [
  {
    id: "gewe",
    slug: "gewe",
    title: "Gewe",
    year: "2025",
    category: "Venture",
    role: "Co-founder & CEO",
    room: "gallery-i",
    status: "active",
    coverImage: {
      src: "generative:gewe",
      alt: "Generative composition standing in for the Gewe cover image",
    },
    summary: "[PLACEHOLDER] One-line curatorial description to be written.",
    story: {
      problem: "[PLACEHOLDER] The problem this venture exists to solve.",
      built: "[PLACEHOLDER] What was built.",
      matters: "[PLACEHOLDER] Why it matters.",
    },
    gallery: [],
    links: [],
    outcomes: [],
    placeholder: true,
  },
  {
    id: "porchlight",
    slug: "porchlight",
    title: "Porchlight",
    year: "2026",
    category: "Venture",
    role: "Founder",
    room: "gallery-i",
    status: "in-progress",
    coverImage: {
      src: "generative:porchlight",
      alt: "Generative composition standing in for the Porchlight cover image",
    },
    summary: "[PLACEHOLDER] One-line curatorial description to be written.",
    story: {
      problem: "[PLACEHOLDER] The problem this venture exists to solve.",
      built: "[PLACEHOLDER] What was built.",
      matters: "[PLACEHOLDER] Why it matters.",
    },
    gallery: [],
    links: [],
    outcomes: [],
    placeholder: true,
  },
  {
    id: "ai-product",
    slug: "ai-and-product",
    title: "AI & Product Work",
    year: "2020",
    category: "Practice",
    role: "Product & Data Science",
    room: "gallery-i",
    status: "shipped",
    coverImage: {
      src: "generative:ai-product",
      alt: "Generative composition standing in for the AI and product work cover image",
    },
    summary: "[PLACEHOLDER] One-line curatorial description to be written.",
    story: {
      problem: "[PLACEHOLDER] The problem this work addressed.",
      built: "[PLACEHOLDER] What was built.",
      matters: "[PLACEHOLDER] Why it matters.",
    },
    gallery: [],
    links: [],
    outcomes: [],
    placeholder: true,
  },
];

export const exhibits: Exhibit[] = entries.map((entry) =>
  exhibitSchema.parse(entry),
);
