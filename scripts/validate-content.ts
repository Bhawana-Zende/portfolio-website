/**
 * Content gate. Runs before every build.
 *
 * The museum has one rule: every image on a wall is an exhibit. This
 * script enforces it, plus unique slugs and real alt text. A failure here
 * is meant to stop the build — a wall with an unlabelled or unattached
 * image is a broken room, not a warning.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, posix, relative, sep } from "node:path";
import { articles } from "../content/articles";
import { artworks } from "../content/art";
import { books } from "../content/books";
import { exhibits } from "../content/exhibits";
import { timeline } from "../content/timeline";
import type { MuseumImage } from "../content/schema";

const problems: string[] = [];
const notes: string[] = [];

/** Directories in /public whose contents are images hung on a wall. */
const WALL_DIRS = ["exhibits", "art", "articles"];

type Walled = {
  kind: string;
  slug: string;
  title: string;
  coverImage: MuseumImage;
  gallery: MuseumImage[];
};

const walled: Walled[] = [
  ...exhibits.map((e) => ({ kind: "exhibit", ...e })),
  ...articles.map((a) => ({ kind: "article", ...a })),
  ...artworks.map((a) => ({ kind: "artwork", ...a })),
];

/* 1 — slugs must be unique across everything that owns a URL */
const seen = new Map<string, string>();
for (const item of walled) {
  const previous = seen.get(item.slug);
  if (previous) {
    problems.push(
      `Slug collision: "${item.slug}" is used by both ${previous} and ${item.kind} "${item.title}".`,
    );
  } else {
    seen.set(item.slug, `${item.kind} "${item.title}"`);
  }
}

for (const book of books) {
  const previous = seen.get(`book:${book.slug}`);
  if (previous) {
    problems.push(`Slug collision: book "${book.slug}" is declared twice.`);
  }
  seen.set(`book:${book.slug}`, `book "${book.title}"`);
}

/* 2 — every image needs alt text that says something */
const referenced = new Set<string>();

for (const item of walled) {
  const images = [item.coverImage, ...item.gallery];
  for (const image of images) {
    const where = `${item.kind} "${item.title}"`;
    if (!image.alt || image.alt.trim().length < 8) {
      problems.push(`Missing alt text: ${where} → ${image.src}`);
    }
    if (image.src.startsWith("/")) {
      referenced.add(posix.normalize(image.src));
      const onDisk = join(process.cwd(), "public", image.src);
      if (!existsSync(onDisk)) {
        problems.push(`Image file not found: ${where} → public${image.src}`);
      }
    }
  }
}

/* 3 — every image file on a wall must belong to an exhibit */
function filesIn(dir: string): string[] {
  const absolute = join(process.cwd(), "public", dir);
  if (!existsSync(absolute)) return [];
  const out: string[] = [];
  const walk = (current: string) => {
    for (const entry of readdirSync(current)) {
      const full = join(current, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(avif|webp|png|jpe?g|gif|svg)$/i.test(entry)) out.push(full);
    }
  };
  walk(absolute);
  return out;
}

for (const dir of WALL_DIRS) {
  for (const file of filesIn(dir)) {
    const publicPath =
      "/" + relative(join(process.cwd(), "public"), file).split(sep).join("/");
    if (!referenced.has(publicPath)) {
      problems.push(
        `Unattached image: public${publicPath} hangs on a wall but no exhibit links to it.`,
      );
    }
  }
}

/* 4 — placeholders are allowed, but they get counted out loud */
const placeholders = walled.filter((item) => "placeholder" in item && item.placeholder);
const unconfirmed = timeline.filter((milestone) => milestone.confirm);
const privateBooks = books.filter((book) => book.private);

notes.push(`${walled.length} walled items, ${books.length} books, ${timeline.length} milestones`);
notes.push(`${placeholders.length} placeholder entries still to replace`);
notes.push(`${unconfirmed.length} timeline entries marked [CONFIRM]`);
notes.push(`${privateBooks.length} books hidden from the site`);

for (const note of notes) console.log(`  · ${note}`);

if (problems.length > 0) {
  console.error(`\n✗ Content check failed — ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  console.error("");
  process.exit(1);
}

console.log("\n✓ Content check passed\n");
