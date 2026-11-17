import { between, pick, rng, seedFrom, type Rand } from "@/lib/seed";

/**
 * The pieces on the walls.
 *
 * Five schools, chosen by seed, each drawn from the same restricted
 * vocabulary the building uses: horizons, arcs, rules, slats, a single
 * stone. Everything is painted in theme variables, so a piece is lit by
 * whichever room it's hanging in rather than carrying its own colour.
 */
type School = "horizon" | "arc" | "rule" | "slat" | "stone";

const SCHOOLS: readonly School[] = ["horizon", "arc", "rule", "slat", "stone"];

// No saturated colour anywhere: the system is warm grays and black.
// A piece keeps its own ground so it reads as a print on the wall
// rather than a surface that inverts with the room.
const INK = "var(--room-fg, var(--color-ink))";
const ACCENT = "var(--room-muted, var(--color-graphite))";
const GROUND = "var(--room-card, var(--color-bone))";

function horizon(r: Rand, w: number, h: number) {
  const bands = Math.floor(between(r, 4, 8));
  const nodes = [];
  let y = between(r, 0.1, 0.28) * h;
  const accentBand = Math.floor(r() * bands);

  for (let i = 0; i < bands && y < h; i += 1) {
    const thickness = between(r, 0.012, 0.11) * h;
    const inset = between(r, 0, 0.14) * w;
    nodes.push(
      <rect
        key={i}
        x={inset}
        y={y}
        width={w - inset - between(r, 0, 0.1) * w}
        height={thickness}
        fill={i === accentBand ? ACCENT : INK}
        opacity={i === accentBand ? 0.5 : between(r, 0.06, 0.2)}
      />,
    );
    y += thickness + between(r, 0.03, 0.14) * h;
  }
  return nodes;
}

function arc(r: Rand, w: number, h: number) {
  const rings = Math.floor(between(r, 3, 7));
  const cx = between(r, 0.18, 0.82) * w;
  const cy = between(r, 0.55, 1.05) * h;
  const step = between(r, 0.1, 0.17) * w;
  const accentRing = Math.floor(r() * rings);

  return Array.from({ length: rings }, (_, i) => (
    <circle
      key={i}
      cx={cx}
      cy={cy}
      r={step * (i + 1)}
      fill="none"
      stroke={i === accentRing ? ACCENT : INK}
      strokeWidth={i === accentRing ? 1.6 : between(r, 0.5, 1.2)}
      opacity={i === accentRing ? 0.6 : between(r, 0.14, 0.34)}
    />
  ));
}

function rule(r: Rand, w: number, h: number) {
  const cols = Math.floor(between(r, 6, 12));
  const rows = Math.floor(between(r, 7, 14));
  const gx = w / cols;
  const gy = h / rows;
  const nodes = [];

  for (let i = 1; i < cols; i += 1) {
    nodes.push(
      <line key={`v${i}`} x1={i * gx} y1={0} x2={i * gx} y2={h} stroke={INK} strokeWidth={0.5} opacity={0.14} />,
    );
  }
  for (let i = 1; i < rows; i += 1) {
    nodes.push(
      <line key={`h${i}`} x1={0} y1={i * gy} x2={w} y2={i * gy} stroke={INK} strokeWidth={0.5} opacity={0.14} />,
    );
  }
  const filled = Math.floor(between(r, 2, 6));
  for (let i = 0; i < filled; i += 1) {
    const cx = Math.floor(r() * cols);
    const cy = Math.floor(r() * rows);
    nodes.push(
      <rect
        key={`f${i}`}
        x={cx * gx}
        y={cy * gy}
        width={gx}
        height={gy}
        fill={i === 0 ? ACCENT : INK}
        opacity={i === 0 ? 0.45 : between(r, 0.1, 0.3)}
      />,
    );
  }
  return nodes;
}

function slat(r: Rand, w: number, h: number) {
  const count = Math.floor(between(r, 7, 16));
  const gap = w / count;
  const offset = Math.floor(r() * count);

  return Array.from({ length: count }, (_, i) => {
    const drop = i === offset ? between(r, 0.1, 0.3) * h : 0;
    return (
      <rect
        key={i}
        x={i * gap + gap * 0.3}
        y={drop}
        width={gap * 0.4}
        height={h - drop - (i === offset ? 0 : between(r, 0, 0.2) * h)}
        fill={i === offset ? ACCENT : INK}
        opacity={i === offset ? 0.5 : between(r, 0.08, 0.22)}
      />
    );
  });
}

function stone(r: Rand, w: number, h: number) {
  const cx = between(r, 0.32, 0.68) * w;
  const cy = between(r, 0.34, 0.6) * h;
  const rad = between(r, 0.2, 0.34) * Math.min(w, h);
  const horizonY = cy + rad + between(r, 0.04, 0.2) * h;

  return [
    <circle key="s" cx={cx} cy={cy} r={rad} fill={INK} opacity={between(r, 0.16, 0.3)} />,
    <circle
      key="h"
      cx={cx - rad * 0.22}
      cy={cy - rad * 0.24}
      r={rad * 0.72}
      fill={ACCENT}
      opacity={0.14}
    />,
    horizonY < h ? (
      <rect key="g" x={0} y={horizonY} width={w} height={1} fill={INK} opacity={0.3} />
    ) : null,
  ];
}

export function GenerativePiece({
  seed,
  ratio = 0.78,
  className,
  index = 0,
}: {
  seed: string;
  ratio?: number;
  className?: string;
  /** Position on the wall. Rotates the school so neighbours differ. */
  index?: number;
}) {
  const r = rng(seedFrom(seed));
  // nearby seeds correlate on the first draws — warm the generator up so
  // "artwork-2" and "artwork-3" don't come out as the same picture
  for (let i = 0; i < 6; i += 1) r();

  const w = 400;
  const h = Math.round(w / ratio);
  const school =
    SCHOOLS[(SCHOOLS.indexOf(pick(r, SCHOOLS)) + index) % SCHOOLS.length];

  const draw = {
    horizon,
    arc,
    rule,
    slat,
    stone,
  }[school];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
    >
      <rect width={w} height={h} fill={GROUND} />
      <g>{draw(r, w, h)}</g>
    </svg>
  );
}
