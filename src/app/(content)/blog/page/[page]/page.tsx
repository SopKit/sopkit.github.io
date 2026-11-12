import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BlogArchive from "@/components/content/BlogArchive";
import { buildCanonicalUrl } from "@/seo/canonical";
import { formatSeoDescription } from "@/seo/metadata";
import { getSortedBlogs } from "@/lib/blog";

interface BlogPaginationPageProps {
  params: Promise<{ page: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const totalPages = Math.max(1, Math.ceil(getSortedBlogs().length / 12));
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({
  params,
}: BlogPaginationPageProps): Promise<Metadata> {
  const { page: rawPage } = await params;
  const page = Number.parseInt(rawPage, 10);
  const totalArticles = getSortedBlogs().length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / 12));
  const currentPage = Math.min(Math.max(Number.isFinite(page) ? page : 1, 1), totalPages);
  const canonical = buildCanonicalUrl(
    currentPage === 1 ? "/blog" : `/blog/page/${currentPage}`,
  );
  // Each archive page needs its own description, or every page shares one
  // duplicate snippet in search results.
  const description = formatSeoDescription(
    `Page ${currentPage} of ${totalPages}: practical guides, tutorials, comparisons, and workflows for free online tools and everyday digital tasks.`,
  );

  return {
    title: `SopKit Blog — Page ${currentPage} of ${totalPages}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `SopKit Blog — Page ${currentPage} of ${totalPages}`,
      description,
      url: canonical,
      siteName: "SopKit",
      images: [{ url: "/og-image.jpg" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@sopkit",
      title: `SopKit Blog — Page ${currentPage} of ${totalPages}`,
      description,
      images: ["/og-image.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPaginationPage({
  params,
}: BlogPaginationPageProps) {
  const { page: rawPage } = await params;
  const parsedPage = Number.parseInt(rawPage, 10);
  if (!Number.isFinite(parsedPage) || parsedPage < 2) {
    redirect("/blog/");
  }

  const totalArticles = getSortedBlogs().length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / 12));
  const currentPage = Math.min(Math.max(parsedPage, 1), totalPages);
  if (currentPage !== parsedPage) notFound();

  return <BlogArchive currentPage={currentPage} />;
}
