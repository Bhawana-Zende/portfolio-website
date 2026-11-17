/**
 * The architectural overlay: hairline geometry with small diamond nodes
 * at the vertices, drawn over a dark room. It reads as a construction
 * drawing laid over the wall — the thing that makes a black section feel
 * like a plan rather than an empty box.
 *
 * Flat strokes only, no gradients, no shadows.
 */
export function Wireframe({
  variant = "chevron",
}: {
  variant?: "chevron" | "diamond" | "corners";
}) {
  const node = (x: number, y: number) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(45)`}>
      <rect
        x={-2.2}
        y={-2.2}
        width={4.4}
        height={4.4}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.6}
      />
    </g>
  );

  const shapes = {
    chevron: (
      <>
        <path d="M0 78 L50 22 L100 78" fill="none" stroke="currentColor" strokeWidth={0.3} />
        <line x1="0" y1="78" x2="100" y2="78" stroke="currentColor" strokeWidth={0.3} />
        {node(50, 22)}
        {node(0, 78)}
        {node(100, 78)}
      </>
    ),
    diamond: (
      <>
        <path d="M50 8 L96 50 L50 92 L4 50 Z" fill="none" stroke="currentColor" strokeWidth={0.3} />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth={0.3} />
        {node(50, 8)}
        {node(96, 50)}
        {node(50, 92)}
        {node(4, 50)}
      </>
    ),
    corners: (
      <>
        <path d="M4 4 L96 4 L96 96 L4 96 Z" fill="none" stroke="currentColor" strokeWidth={0.3} />
        <path d="M4 18 L18 4 M82 4 L96 18 M96 82 L82 96 M18 96 L4 82" fill="none" stroke="currentColor" strokeWidth={0.3} />
        {node(4, 18)}
        {node(18, 4)}
        {node(82, 4)}
        {node(96, 18)}
        {node(96, 82)}
        {node(82, 96)}
        {node(18, 96)}
        {node(4, 82)}
      </>
    ),
  }[variant];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ color: "currentColor", opacity: 0.28 }}
    >
      {shapes}
    </svg>
  );
}
