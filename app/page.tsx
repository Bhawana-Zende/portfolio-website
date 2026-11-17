import { Foyer } from "@/components/foyer/Foyer";
import { site } from "@/content/site";
import { ROOMS } from "@/content/schema";

const ROOM_LABELS: Record<string, string> = {
  "gallery-i": "Gallery I · Work & Ventures",
  "gallery-ii": "Gallery II · Writing",
  "gallery-iii": "Gallery III · Art",
  "gallery-iv": "Gallery IV · Library",
  corridor: "Corridor · Résumé",
  exit: "Exit · Guestbook",
};

export default function Home() {
  return (
    <>
      <Foyer name={site.name} intro={site.intro} />

      {/* The threshold. The rooms themselves open in the next step; this
          strip exists so "Enter" leads somewhere honest. */}
      <section
        id="threshold"
        aria-label="Threshold"
        className="relative flex min-h-[70svh] flex-col justify-center px-6 py-[var(--spacing-room)] sm:px-10 lg:px-16"
      >
        <p className="u-micro m-0" style={{ color: "var(--ink-faint)" }}>
          Beyond this point
        </p>

        <hr className="u-hairline my-8 w-full max-w-[34rem]" />

        <ul className="m-0 flex list-none flex-col gap-5 p-0">
          {ROOMS.filter((room) => room !== "foyer").map((room) => (
            <li key={room}>
              <span
                className="u-room-title block"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(1.25rem, 1rem + 1vw, 1.75rem)",
                }}
              >
                {ROOM_LABELS[room]}
              </span>
            </li>
          ))}
        </ul>

        <p
          className="u-label m-0 mt-14 max-w-[28rem]"
          style={{ color: "var(--ink-muted)" }}
        >
          Floor plan and doorways open next
        </p>
      </section>
    </>
  );
}
