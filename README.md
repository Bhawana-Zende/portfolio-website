# Bhawana Zende — The Museum

An immersive portfolio built as a museum you walk through, room by room.

- **Live:** bhawanazende.com (DNS not yet pointed)
- **Stack:** Next.js (App Router), TypeScript, Tailwind v4, GSAP, Lenis
- **Content:** everything on the walls comes from `content/` — see
  [CONTENT.md](./CONTENT.md)

## Commands

```bash
npm run dev        # the museum at localhost:3000
npm run validate   # check the content rules
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # validate, then build
```

`npm run build` runs the content check first and fails if a wall has an
unattached image, an image without alt text, or two things sharing a slug.

## Lighting

The site has two modes, daylight and evening, set before first paint from
`localStorage` and falling back to the visitor's system preference. Design
tokens for both live at the top of `app/globals.css`.

## A note on this repository

This repository is public. The `private` flag on a book hides it from the
site, not from GitHub. Private notes belong outside this repo.
