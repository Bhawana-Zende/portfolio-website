"use client";

/**
 * Letters cut into a wall. Each glyph sits in its own mask so the
 * entrance timeline can lift them through it — the reveal reads as
 * light crossing the inscription, not as text fading in.
 *
 * The visible glyphs are decorative; the accessible name is on the
 * wrapper, so a screen reader hears one name instead of thirteen.
 */
export function Inscription({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    // flex-wrap, not inline text: the words must be able to break onto a
    // second line on a phone without a breakable space between the masks
    <h1
      className="u-inscription m-0 flex flex-wrap items-baseline gap-x-[0.26em]"
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block">
          {Array.from(word).map((char, charIndex) => (
            <span
              key={`${char}-${charIndex}`}
              className="reveal-mask"
              aria-hidden="true"
            >
              <span data-inscription-glyph="">{char}</span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
