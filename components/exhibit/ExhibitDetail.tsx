import { GenerativePiece } from "@/components/art/GenerativePiece";
import type { Exhibit } from "@/content/schema";
import { neighbours } from "@/lib/museum";

function Piece({
  src,
  alt,
  seed,
  ratio,
}: {
  src: string;
  alt: string;
  seed: string;
  ratio: number;
}) {
  if (src.startsWith("generative:")) {
    return <GenerativePiece seed={seed} ratio={ratio} className="h-full w-full" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="h-full w-full object-cover" />;
}

/** The long look: what it was, what was made, what came of it. */
export function ExhibitDetail({
  exhibit,
  onNavigate,
}: {
  exhibit: Exhibit;
  onNavigate?: (slug: string) => void;
}) {
  const { previous, next } = neighbours(exhibit.slug);

  return (
    <article className="mx-auto w-full max-w-[64rem] px-5 pb-[var(--spacing-96)] sm:px-7">
      <div
        className="relative mb-[var(--spacing-52)] w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 10",
          background: "var(--room-placeholder)",
          borderRadius: "var(--radius-cards)",
        }}
      >
        <Piece
          src={exhibit.coverImage.src}
          alt={exhibit.coverImage.alt}
          seed={exhibit.slug}
          ratio={1.6}
        />
      </div>

      <p className="t-micro" style={{ color: "var(--room-muted)" }}>
        {exhibit.category}
      </p>

      <h1 className="t-section mt-[16px]">
        {exhibit.title}
      </h1>

      <dl className="mt-[var(--spacing-40)] grid grid-cols-2 gap-[var(--spacing-28)] sm:grid-cols-4">
        {[
          ["Year", exhibit.year],
          ["Role", exhibit.role],
          ["Medium", exhibit.category],
          ["Status", exhibit.status.replace("-", " ")],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="t-micro" style={{ color: "var(--room-muted)" }}>
              {label}
            </dt>
            <dd
              className="t-stat mt-[8px] block"
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <hr className="u-rule my-[var(--spacing-52)]" />

      <div className="grid gap-[var(--spacing-40)] md:grid-cols-[14rem_1fr]">
        {[
          ["The problem", exhibit.story.problem],
          ["What I built", exhibit.story.built],
          ["Why it matters", exhibit.story.matters],
        ].map(([label, body]) => (
          <div key={label} className="contents">
            <p className="t-micro" style={{ color: "var(--room-muted)" }}>
              {label}
            </p>
            <p
              className="t-body max-w-[62ch]"
              style={{ fontSize: "16px" }}
            >
              {body}
            </p>
          </div>
        ))}
      </div>

      {exhibit.outcomes.length > 0 ? (
        <>
          <hr className="u-rule my-[var(--spacing-52)]" />
          <ul className="t-body m-0 grid list-none gap-[16px] p-0 sm:grid-cols-2">
            {exhibit.outcomes.map((line) => (
              <li
                key={line}
                className="m-0"
                style={{ fontSize: "var(--text-body-sm)", opacity: 0.8 }}
              >
                {line}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {exhibit.gallery.length > 0 ? (
        <div className="mt-[var(--spacing-52)] grid gap-[28px] sm:grid-cols-2">
          {exhibit.gallery.map((image) => (
            <div
              key={image.src}
              className="relative overflow-hidden"
              style={{
                aspectRatio: "4 / 3",
                background: "var(--room-placeholder)",
                borderRadius: "var(--radius-cards)",
              }}
            >
              <Piece src={image.src} alt={image.alt} seed={image.src} ratio={1.33} />
            </div>
          ))}
        </div>
      ) : null}

      {exhibit.links.length > 0 ? (
        <ul className="mt-[var(--spacing-52)] flex list-none flex-wrap gap-[28px] p-0">
          {exhibit.links.map((link) => (
            <li key={link.href} className="m-0">
              <a
                href={link.href}
                className="c-link t-label"
                target="_blank"
                rel="noreferrer noopener"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <hr className="u-rule my-[var(--spacing-52)]" />

      <nav className="flex items-start justify-between gap-6" aria-label="Exhibits">
        {previous ? (
          <ExhibitStep
            exhibit={previous}
            direction="previous"
            onNavigate={onNavigate}
          />
        ) : (
          <span />
        )}
        {next ? (
          <ExhibitStep exhibit={next} direction="next" onNavigate={onNavigate} />
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

function ExhibitStep({
  exhibit,
  direction,
  onNavigate,
}: {
  exhibit: Exhibit;
  direction: "previous" | "next";
  onNavigate?: (slug: string) => void;
}) {
  const label = direction === "previous" ? "← Previous exhibit" : "Next exhibit →";
  const align = direction === "previous" ? "text-left" : "text-right";

  const content = (
    <>
      <span className="t-micro block" style={{ color: "var(--room-muted)" }}>
        {label}
      </span>
      <span
        className="t-caption mt-[12px] block"
      >
        {exhibit.title}
      </span>
    </>
  );

  if (onNavigate) {
    return (
      <button
        type="button"
        onClick={() => onNavigate(exhibit.slug)}
        className={align}
      >
        {content}
      </button>
    );
  }

  return (
    <a href={`/exhibit/${exhibit.slug}`} className={align}>
      {content}
    </a>
  );
}
