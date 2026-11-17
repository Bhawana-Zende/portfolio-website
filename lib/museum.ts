import { exhibits } from "@/content/exhibits";
import { articles } from "@/content/articles";
import { artworks } from "@/content/art";
import type { Exhibit, Room } from "@/content/schema";

/**
 * One walking order through the whole building. Previous/next follow the
 * route a visitor actually takes, not the order the files happen to be in.
 */
export const allExhibits: Exhibit[] = [...exhibits, ...articles, ...artworks];

export function exhibitBySlug(slug: string): Exhibit | undefined {
  return allExhibits.find((item) => item.slug === slug);
}

export function exhibitsInRoom(room: Room): Exhibit[] {
  return allExhibits.filter((item) => item.room === room);
}

export function neighbours(slug: string) {
  const index = allExhibits.findIndex((item) => item.slug === slug);
  return {
    previous: index > 0 ? allExhibits[index - 1] : undefined,
    next:
      index >= 0 && index < allExhibits.length - 1
        ? allExhibits[index + 1]
        : undefined,
  };
}

export const ROOM_META: Record<
  Room,
  { label: string; name: string; note: string }
> = {
  foyer: { label: "Foyer", name: "Foyer", note: "The entrance" },
  "gallery-i": {
    label: "Gallery I",
    name: "Work & Ventures",
    note: "What I've built, and why",
  },
  "gallery-ii": {
    label: "Gallery II",
    name: "Writing",
    note: "Essays and industry pieces",
  },
  "gallery-iii": {
    label: "Gallery III",
    name: "Art",
    note: "A long wall, walked slowly",
  },
  "gallery-iv": {
    label: "Gallery IV",
    name: "Library",
    note: "What I read, and keep",
  },
  corridor: {
    label: "Corridor",
    name: "Résumé",
    note: "A walk through the years",
  },
  exit: { label: "Exit", name: "Guestbook", note: "Leave a note on the way out" },
};
