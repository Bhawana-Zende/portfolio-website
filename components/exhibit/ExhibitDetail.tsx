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
    <article className="mx-auto w-full max-w-[64rem] px-6 pb-[var(--spacing-room)] sm:px-10">
      <div
        className="relative mb-12 w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 10",
          background: "var(--wall-recess)",
          border: "1px solid var(--hairline)",
        }}
      >
        <Piece
          src={exhibit.coverImage.src}
          alt={exhibit.coverImage.alt}
          seed={exhibit.slug}
          ratio={1.6}
        />
      </div>

      <p className="u-micro m-0" style={{ color: "var(--accent)" }}>
        {exhibit.category}
      </p>

      <h1 className="u-exhibit-title m-0 mt-4" style={{ fontSize: "var(--text-room)" }}>
        {exhibit.title}
      </h1>

      <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[
          ["Year", exhibit.year],
          ["Role", exhibit.role],
          ["Medium", exhibit.category],
          ["Status", exhibit.status.replace("-", " ")],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="u-micro m-0" style={{ color: "var(--ink-faint)" }}>
              {label}
            </dt>
            <dd
              className="u-year m-0 mt-2"
              style={{ fontSize: "var(--text-label)", color: "var(--ink)" }}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <hr className="u-hairline my-12" />

      <div className="grid gap-12 md:grid-cols-[14rem_1fr]">
        {[
          ["The problem", exhibit.story.problem],
          ["What I built", exhibit.story.built],
          ["Why it matters", exhibit.story.matters],
        ].map(([label, body]) => (
          <div key={label} className="contents">
            <p className="u-label m-0" style={{ color: "var(--ink-faint)" }}>
              {label}
            </p>
            <p
              className="m-0 max-w-[40rem]"
              style={{ color: "var(--ink-muted)", fontSize: "var(--text-body)" }}
            >
              {body}
            </p>
          </div>
        ))}
      </div>

      {exhibit.outcomes.length > 0 ? (
        <>
          <hr className="u-hairline my-12" />
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
            {exhibit.outcomes.map((line) => (
              <li
                key={line}
                className="m-0"
                style={{ color: "var(--ink-muted)", fontSize: "var(--text-label)" }}
              >
                {line}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {exhibit.gallery.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {exhibit.gallery.map((image) => (
            <div
              key={image.src}
              className="relative overflow-hidden"
              style={{
                aspectRatio: "4 / 3",
                background: "var(--wall-recess)",
                border: "1px solid var(--hairline)",
              }}
            >
              <Piece src={image.src} alt={image.alt} seed={image.src} ratio={1.33} />
            </div>
          ))}
        </div>
      ) : null}

      {exhibit.links.length > 0 ? (
        <ul className="mt-12 flex list-none flex-wrap gap-6 p-0">
          {exhibit.links.map((link) => (
            <li key={link.href} className="m-0">
              <a
                href={link.href}
                className="u-label"
                style={{ color: "var(--accent)" }}
                target="_blank"
                rel="noreferrer noopener"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <hr className="u-hairline my-12" />

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
      <span className="u-micro block" style={{ color: "var(--ink-faint)" }}>
        {label}
      </span>
      <span
        className="u-exhibit-title mt-3 block"
        style={{ fontSize: "clamp(1.0625rem, 1rem + 0.4vw, 1.25rem)" }}
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
