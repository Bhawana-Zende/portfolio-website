/**
 * Plaster tooth. One fixed layer, no repaints, never interactive.
 * Opacity comes from the lighting mode so evening keeps some texture
 * without turning the wall grey.
 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="grain room-surface pointer-events-none fixed inset-0 z-50"
      style={{
        opacity: "var(--grain-opacity)",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
