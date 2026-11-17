/**
 * The painting the whole museum is built over. One canvas runs behind
 * every room; the opaque rooms cover it and the open rooms reveal it, so
 * walking the building is walking through one landscape.
 *
 * To change it: pick an entry from `backdropAlternatives` below (the
 * files are already in /public/backdrop/) and move its details up here.
 * Keep `credit` accurate — the work is public domain, not unattributed.
 */
export const backdrop = {
  src: "/backdrop/lorrain-roman-campagna.jpg",
  srcSmall: "/backdrop/lorrain-roman-campagna-sm.jpg",
  alt: "A pastoral landscape at golden hour: a shepherd piping beside grazing cattle and sheep, a walled tower among trees, and a lake running out to distant hills",
  credit: {
    title: "Pastoral Landscape: The Roman Campagna",
    artist: "Claude Lorrain",
    source: "The Metropolitan Museum of Art",
    licence: "Public domain (CC0)",
    url: "https://www.metmuseum.org/art/collection/search/435906",
  },
  /** Which band of the canvas sits in view at the top of the walk. */
  focus: "center 38%",
  /** How hard to darken the painting so type reads over it, per mode. */
  scrim: { daylight: 0.26, evening: 0.58 },
} as const;

/** Downloaded and ready to swap into `backdrop` above. */
export const backdropAlternatives = [
  {
    src: "/backdrop/castiglione-shepherd-and-sheep.jpg",
    artist: "Giovanni Benedetto Castiglione",
    title: "Roman Landscape with a Shepherd and Sheep",
    note: "The most animals and the liveliest, but busy — the flock competes with centred type",
  },
  {
    src: "/backdrop/lorrain-the-ford.jpg",
    artist: "Claude Lorrain",
    title: "The Ford",
    note: "Soft and hazy; figures are small and there are no animals",
  },
  {
    src: "/backdrop/dughet-imaginary-landscape.jpg",
    artist: "Gaspard Dughet",
    title: "Imaginary Landscape",
    note: "Dusk and sombre — the after-hours museum rather than a happy one",
  },
  {
    src: "/backdrop/lorrain-la-crescenza.jpg",
    artist: "Claude Lorrain",
    title: "View of La Crescenza",
    note: "Lighter and bluer, more open sky; needs a heavier scrim for type",
  },
  {
    src: "/backdrop/mauperche-classical-landscape.jpg",
    artist: "Henri Mauperché",
    title: "Classical Landscape with Figures",
    note: "Architectural and warm; bright stone on the right competes with the wordmark",
  },
] as const;
