"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { Foyer } from "@/components/foyer/Foyer";
import { Room } from "./Room";
import { LongWall } from "./LongWall";
import { Shelf } from "./Shelf";
import { Milestones } from "./Milestones";
import { Guestbook } from "./Guestbook";
import { FloorPlan } from "./FloorPlan";
import { Frame } from "@/components/exhibit/Frame";
import { ExhibitOverlay } from "@/components/exhibit/ExhibitOverlay";
import { ROOMS, type Book, type Exhibit, type Milestone, type Room as RoomId } from "@/content/schema";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { site } from "@/content/site";

export function Museum({
  ventures,
  writing,
  art,
  books,
  timeline,
  initialExhibit,
}: {
  ventures: Exhibit[];
  writing: Exhibit[];
  art: Exhibit[];
  books: Book[];
  timeline: Milestone[];
  initialExhibit?: string;
}) {
  const [current, setCurrent] = useState<RoomId>("foyer");
  const [open, setOpen] = useState<string | undefined>(initialExhibit);
  const lenis = useRef<Lenis | null>(null);
  const cameFrom = useRef<string | null>(null);
  const reduced = useReducedMotion();

  /* smooth, inertial walking — off entirely when motion is reduced */
  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.current = instance;

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenis.current = null;
    };
  }, [reduced]);

  /* which room the visitor is standing in */
  useEffect(() => {
    const sections = ROOMS.map((room) =>
      document.querySelector<HTMLElement>(`[data-room="${room}"]`),
    ).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const room = visible?.target.getAttribute("data-room") as RoomId | null;
        if (room) setCurrent(room);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const walk = useCallback(
    (room: RoomId) => {
      const target = document.querySelector<HTMLElement>(`[data-room="${room}"]`);
      if (!target) return;
      if (lenis.current) lenis.current.scrollTo(target, { offset: -8 });
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  /* stepping closer, and stepping back with the browser's own button */
  const openExhibit = useCallback((slug: string) => {
    cameFrom.current = slug;
    setOpen(slug);
    window.history.pushState({ exhibit: slug }, "", `/exhibit/${slug}`);
  }, []);

  const closeExhibit = useCallback(() => {
    setOpen(undefined);
    if (window.history.state?.exhibit) window.history.back();
    // focus returns to the piece the visitor stepped away from
    const slug = cameFrom.current;
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-exhibit="${slug}"]`)?.focus();
    });
  }, []);

  useEffect(() => {
    const onPop = () => {
      const slug = window.history.state?.exhibit as string | undefined;
      setOpen(slug);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <>
      <Foyer
        name={site.name}
        hero={site.hero}
        stats={[
          { label: "Rooms", value: String(ROOMS.length - 1) },
          { label: "Exhibits", value: String(ventures.length + writing.length + art.length) },
          { label: "Books", value: String(books.length) },
        ]}
      />

      <Room id="gallery-i" tone="dark" wireframe="chevron">
        <div className="grid gap-[clamp(3rem,6vw,5rem)] sm:grid-cols-2 lg:grid-cols-3">
          {ventures.map((exhibit, index) => (
            <Frame
              key={exhibit.slug}
              exhibit={exhibit}
              onOpen={openExhibit}
              eager={index === 0}
              index={index}
            />
          ))}
        </div>
      </Room>

      <Room id="gallery-ii" tone="light">
        <div className="grid gap-[clamp(3rem,6vw,5rem)] sm:grid-cols-2">
          {writing.map((exhibit, index) => (
            <Frame
              key={exhibit.slug}
              exhibit={exhibit}
              onOpen={openExhibit}
              ratio={1.4}
              index={index}
            />
          ))}
        </div>
      </Room>

      <Room id="gallery-iii" tone="dark" wide wireframe="corners">
        <LongWall>
          {art.map((exhibit, index) => (
            <div
              key={exhibit.slug}
              className="shrink-0"
              style={{ width: "min(22rem, 72vw)", scrollSnapAlign: "start" }}
            >
              <Frame
                exhibit={exhibit}
                onOpen={openExhibit}
                shape="circle"
                index={index}
              />
            </div>
          ))}
        </LongWall>
      </Room>

      <Room id="gallery-iv" tone="light">
        <Shelf books={books} />
      </Room>

      <Room id="corridor" tone="dark" wide wireframe="diamond">
        <Milestones milestones={timeline} />
        <a href="/cv.pdf" className="c-pill mt-[var(--spacing-40)]">
          Download CV
        </a>
      </Room>

      <Room id="exit" tone="light">
        <Guestbook />
      </Room>

      <ProgressLine />

      {open ? (
        <ExhibitOverlay
          slug={open}
          onClose={closeExhibit}
          onNavigate={openExhibit}
        />
      ) : null}

      <FloorPlan current={current} onWalk={walk} />
    </>
  );
}

/** A corridor indicator: how far along the building you've walked. */
function ProgressLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const span = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const progress = Math.min(1, window.scrollY / span);
        if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[58] h-px"
      style={{ background: "transparent" }}
    >
      <div
        ref={ref}
        className="h-full w-full origin-left"
        style={{ background: "var(--color-ash)", transform: "scaleX(0)" }}
      />
    </div>
  );
}
