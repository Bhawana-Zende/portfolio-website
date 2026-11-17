import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LightingToggle } from "@/components/atmosphere/LightingToggle";
import { PaintedBackdrop } from "@/components/atmosphere/PaintedBackdrop";
import { lightingBootScript } from "@/lib/theme";
import { site } from "@/content/site";

/**
 * Davinci and Helvetica Now are licensed faces the system names first.
 * These are the documented substitutes that are actually servable:
 * Playfair Display for the display serif, Inter for the utility grotesk.
 * Swap them here if the real faces are licensed — nothing else changes.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — The Museum`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — The Museum`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#c4c3b6" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <head>
        {/* sets the lighting before first paint — no flash of the wrong room */}
        <script dangerouslySetInnerHTML={{ __html: lightingBootScript }} />
      </head>
      <body>
        <PaintedBackdrop />

        {/* the header is a mark and a single link — no navigation chrome */}
        <header
          data-tone="light"
          className="fixed inset-x-0 top-0 z-[61] flex items-center justify-between px-5 py-4 sm:px-7"
          style={{ background: "transparent", color: "inherit" }}
        >
          <a href="#foyer" aria-label={`${site.name} — home`} className="c-link">
            <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <text
                x="16"
                y="21.5"
                textAnchor="middle"
                fill="currentColor"
                style={{ font: "400 15px var(--font-davinci)" }}
              >
                B
              </text>
            </svg>
          </a>

          <LightingToggle />
        </header>

        <a
          href="#gallery-i"
          className="t-label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:px-4 focus:py-2"
          style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
        >
          Skip the entrance
        </a>

        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
