"use client";

/**
 * The wordmark. Each glyph sits in its own mask so the entrance can lift
 * it through — the reveal reads as light crossing cut letters rather
 * than as text fading in.
 *
 * Set at display scale, it runs past the right-hand wall at desktop
 * widths. That overflow is the point: the name is bigger than the room.
 * The accessible name is on the wrapper, so a screen reader hears it
 * once instead of thirteen times.
 */
export function Inscription({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <h1 className="t-display flex whitespace-nowrap" aria-label={text}>
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="inline-block"
          style={{ marginRight: wordIndex < words.length - 1 ? "0.22em" : 0 }}
        >
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
