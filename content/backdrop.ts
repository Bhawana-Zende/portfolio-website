/**
 * The painting the whole museum is built over. One canvas runs behind
 * every room; the opaque rooms cover it and the open rooms reveal it, so
 * walking the building is walking through one landscape.
 *
 * To change it: drop a file in /public/backdrop/ and edit this entry.
 * Keep `credit` accurate — the work is public domain, not unattributed.
 */
export const backdrop = {
  src: "/backdrop/dughet-imaginary-landscape.jpg",
  srcSmall: "/backdrop/dughet-imaginary-landscape-sm.jpg",
  alt: "An imaginary classical landscape: wooded slopes falling to a still lake, a distant walled town and mountains under a dusk sky",
  credit: {
    title: "Imaginary Landscape",
    artist: "Gaspard Dughet",
    source: "The Metropolitan Museum of Art",
    licence: "Public domain (CC0)",
    url: "https://www.metmuseum.org/art/collection/search/436229",
  },
  /** Which band of the canvas sits in view at the top of the walk. */
  focus: "center 38%",
  /** How hard to darken the painting so type reads over it, per mode. */
  scrim: { daylight: 0.26, evening: 0.58 },
} as const;

/** The other two downloaded alternatives, ready to swap into `backdrop`. */
export const backdropAlternatives = [
  {
    src: "/backdrop/lorrain-la-crescenza.jpg",
    label: "Claude Lorrain · View of La Crescenza — lighter, bluer, more open sky",
  },
  {
    src: "/backdrop/mauperche-classical-landscape.jpg",
    label: "Henri Mauperché · Classical Landscape with Figures — architectural, warm stone",
  },
] as const;
