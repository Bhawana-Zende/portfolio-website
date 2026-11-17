import { bookSchema, type Book } from "./schema";

/* GALLERY IV — LIBRARY.
 * Placeholder shelf, in the spirit of what she reads. Replace freely:
 * add `notes` and `passages` to any entry and the book gains a reading.
 *
 * `private: true` hides an entry from the site. It does NOT hide it from
 * this public repository — keep private notes outside the repo entirely. */

const entries: unknown[] = [
  { id: "karamazov", slug: "the-brothers-karamazov", title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", year: "1880" },
  { id: "notes-underground", slug: "notes-from-underground", title: "Notes from Underground", author: "Fyodor Dostoevsky", year: "1864" },
  { id: "crime-punishment", slug: "crime-and-punishment", title: "Crime and Punishment", author: "Fyodor Dostoevsky", year: "1866" },
  { id: "kafka-shore", slug: "kafka-on-the-shore", title: "Kafka on the Shore", author: "Haruki Murakami", year: "2002" },
  { id: "norwegian-wood", slug: "norwegian-wood", title: "Norwegian Wood", author: "Haruki Murakami", year: "1987" },
  { id: "wind-up-bird", slug: "the-wind-up-bird-chronicle", title: "The Wind-Up Bird Chronicle", author: "Haruki Murakami", year: "1994" },
  { id: "post-office", slug: "post-office", title: "Post Office", author: "Charles Bukowski", year: "1971" },
  { id: "ham-on-rye", slug: "ham-on-rye", title: "Ham on Rye", author: "Charles Bukowski", year: "1982" },
  { id: "meditations", slug: "meditations", title: "Meditations", author: "Marcus Aurelius", year: "180" },
  { id: "letters-stoic", slug: "letters-from-a-stoic", title: "Letters from a Stoic", author: "Seneca", year: "65" },
  { id: "east-of-eden", slug: "east-of-eden", title: "East of Eden", author: "John Steinbeck", year: "1952" },
  { id: "bell-jar", slug: "the-bell-jar", title: "The Bell Jar", author: "Sylvia Plath", year: "1963" },
];

export const books: Book[] = entries.map((entry) => bookSchema.parse(entry));

/** What the site renders. Private entries never reach a page. */
export const publicBooks: Book[] = books.filter((book) => !book.private);
