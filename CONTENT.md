# Adding things to the museum

Everything on this site comes from the files in `content/`. You never need
to touch the design to add, edit or remove an exhibit.

After any change, run `npm run validate`. It checks the museum's rules and
tells you, in plain words, what's wrong. The site will not build until it
passes — that's on purpose.

---

## The rules the museum enforces

1. **Every image on a wall belongs to an exhibit.** There are no decorative
   images. If you drop a file into `public/exhibits/`, `public/art/` or
   `public/articles/` and nothing links to it, the build stops.
2. **Every image needs alt text** — a real sentence describing it, not a
   filename.
3. **No two things share a slug.** The slug is the web address.

---

## Where each room lives

| Room | File |
| --- | --- |
| Gallery I · Work & Ventures | `content/exhibits.ts` |
| Gallery II · Writing | `content/articles.ts` |
| Gallery III · Art | `content/art.ts` |
| Gallery IV · Library | `content/books.ts` |
| Corridor · Résumé | `content/timeline.ts` |
| Your name and intro line | `content/site.ts` |

---

## Adding an exhibit (a project, a venture)

Open `content/exhibits.ts` and copy an existing block. Every field:

- **id** — anything unique, lowercase. Used internally.
- **slug** — the web address. `gewe` becomes `/exhibit/gewe`. Lowercase
  letters, numbers and dashes only.
- **title** — what's printed on the placard.
- **year** — shown in tabular figures, so years line up down a wall.
- **category** — the "medium" line on the placard, e.g. `Venture`.
- **role** — your role, e.g. `Co-founder & CEO`.
- **room** — which gallery it hangs in.
- **status** — `active`, `shipped`, `archived` or `in-progress`.
- **coverImage** — the piece on the wall. See *Swapping in a real image*.
- **summary** — the one-line curatorial description under the title.
- **story** — three parts: `problem`, `built`, `matters`. This is the long
  text in the detail view.
- **gallery** — more images, each one expandable. Can be empty: `[]`.
- **links** — `{ label, href, kind }`, where kind is `live`, `article`,
  `video`, `github`, `press` or `other`. Can be empty: `[]`.
- **outcomes** — a list of short lines: numbers, results, reflections.
- **placeholder** — set `false` once you've written the real text. This is
  only used to count what's left to replace.

## Swapping a placeholder image for a real one

Placeholder pieces are drawn by the site itself. They look like this:

```ts
coverImage: {
  src: "generative:gewe",
  alt: "Generative composition standing in for the Gewe cover image",
}
```

To use your own photograph or artwork:

1. Put the file in `public/exhibits/<slug>/` — for example
   `public/exhibits/gewe/cover.jpg`.
2. Change the entry to point at it, and write real alt text:

```ts
coverImage: {
  src: "/exhibits/gewe/cover.jpg",
  alt: "The Gewe dashboard showing a week of scheduled shifts",
}
```

Note the leading `/` and that `public` is not part of the path.

## Adding an article

`content/articles.ts`, same shape as an exhibit plus:
`theme` (`AI`, `Healthcare`, `Founder Life` or `Personal`), `excerpt`,
`readingMinutes`, and `sourceUrl` for the "Read the full piece" link.

## Adding an artwork

`content/art.ts`, same shape as an exhibit plus `medium` and `note`.

## Adding a book

`content/books.ts`. Needs `id`, `slug`, `title`, `author`. Optional:
`year`, `spineColor`, `notes`, `passages`.

> **Private books.** Setting `private: true` hides a book from the website.
> It does **not** hide it from this repository, which is public on GitHub.
> Anything you don't want the world to read must stay out of these files
> entirely — keep those notes somewhere else on your computer.

## Adding a résumé milestone

`content/timeline.ts`. Needs `role`, `place`, `years`, `line` (one
sentence) and `kind` (`work` or `education`). Set `confirm: true` while a
date or title still needs checking — the validator counts these for you.
