/**
 * A floating Ink panel over the painting, with the hairline brackets the
 * system uses at a card's corners. This is how content sits on the
 * canvas without covering it: a cut-out rectangle, not a full section.
 */
export function Panel({
  children,
  className = "",
  scrollCue = false,
}: {
  children: React.ReactNode;
  className?: string;
  scrollCue?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* corner brackets, drawn just outside the panel */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[14px] h-[calc(100%+28px)] w-[calc(100%+28px)]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ color: "var(--color-paper)", opacity: 0.45 }}
      >
        <path
          d="M0 7 L0 0 L7 0 M93 0 L100 0 L100 7 M100 93 L100 100 L93 100 M7 100 L0 100 L0 93"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div
        data-panel=""
        style={{
          background: "var(--color-ink)",
          color: "var(--color-paper)",
          borderRadius: "var(--radius-cards)",
          padding: "var(--spacing-40)",
        }}
      >
        {children}

        {scrollCue ? (
          <div className="mt-[var(--spacing-40)] flex items-center gap-[12px]">
            <span className="t-micro" style={{ color: "var(--color-ash)" }}>
              Scroll
            </span>
            <span aria-hidden="true" className="flex items-center gap-[4px]">
              {[0.3, 0.55, 1].map((o, i) => (
                <span
                  key={i}
                  className="block h-px"
                  style={{
                    width: i === 2 ? 18 : 10,
                    background: "var(--color-paper)",
                    opacity: o,
                  }}
                />
              ))}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
