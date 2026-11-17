import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExhibitDetail } from "@/components/exhibit/ExhibitDetail";
import { allExhibits, exhibitBySlug } from "@/lib/museum";

export function generateStaticParams() {
  return allExhibits.map((exhibit) => ({ slug: exhibit.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exhibit = exhibitBySlug(slug);
  if (!exhibit) return {};
  return {
    title: exhibit.title,
    description: exhibit.summary,
    openGraph: { title: exhibit.title, description: exhibit.summary },
  };
}

export default async function ExhibitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exhibit = exhibitBySlug(slug);
  if (!exhibit) notFound();

  return (
    <div className="pt-24">
      <div className="mx-auto w-full max-w-[64rem] px-6 sm:px-10">
        <Link
          href="/"
          className="u-label inline-block px-4 py-2"
          style={{ color: "var(--ink-muted)", border: "1px solid var(--hairline)" }}
        >
          ← Back to the museum
        </Link>
      </div>
      <div className="mt-10">
        <ExhibitDetail exhibit={exhibit} />
      </div>
    </div>
  );
}
