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
    <div data-tone="light" className="min-h-screen pt-[96px]">
      <div className="mx-auto w-full max-w-[64rem] px-5 sm:px-7">
        <Link
          href="/"
          className="c-pill"
        >
          ← Back to the museum
        </Link>
      </div>
      <div className="mt-[var(--spacing-40)]">
        <ExhibitDetail exhibit={exhibit} />
      </div>
    </div>
  );
}
