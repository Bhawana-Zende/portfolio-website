import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Grain } from "@/components/atmosphere/Grain";
import { RoomLight } from "@/components/atmosphere/RoomLight";
import { LightingToggle } from "@/components/atmosphere/LightingToggle";
import { lightingBootScript } from "@/lib/theme";
import { site } from "@/content/site";

/**
 * Newsreader for anything cut into a wall. It was built for screen reading
 * at text sizes, so it stays sturdy on a placard at 12px — where a
 * high-contrast display serif goes thin and fragile — and its italic has
 * enough character to carry the lede on its own.
 */
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#141311" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // the font variables must live on :root, where the design tokens that
    // reference them are declared — on <body> they resolve to nothing
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${inter.variable}`}
    >
      <head>
        {/* sets the lighting before first paint — no flash of the wrong room */}
        <script dangerouslySetInnerHTML={{ __html: lightingBootScript }} />
      </head>
      <body className="room-surface">
        <RoomLight />
        <Grain />

        <a
          href="#threshold"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:bg-wall focus:px-4 focus:py-2"
        >
          Skip the entrance
        </a>

        <div className="fixed top-5 right-5 z-[60] sm:top-7 sm:right-7">
          <LightingToggle />
        </div>

        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
