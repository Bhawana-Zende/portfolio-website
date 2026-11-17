import { bookSchema, type Book } from "./schema";

/* GALLERY IV — LIBRARY.
 * `private: true` hides an entry from the site. It does not hide it from
 * this public repository: keep private notes outside the repo entirely. */

const entries: unknown[] = [
  { id: "karamazov", slug: "the-brothers-karamazov", title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", year: "1880" },
  { id: "kafka-shore", slug: "kafka-on-the-shore", title: "Kafka on the Shore", author: "Haruki Murakami", year: "2002" },
  { id: "post-office", slug: "post-office", title: "Post Office", author: "Charles Bukowski", year: "1971" },
  { id: "meditations", slug: "meditations", title: "Meditations", author: "Marcus Aurelius", year: "180" },
];

export const books: Book[] = entries.map((entry) => bookSchema.parse(entry));

/** What the site renders. Private entries never reach a page. */
export const publicBooks: Book[] = books.filter((book) => !book.private);
