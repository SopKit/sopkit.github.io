import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BlogArchive from "@/components/content/BlogArchive";
import { SITE_URL } from "@/constants/config";
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
  const canonical = currentPage === 1
    ? `${SITE_URL}/blog/`
    : `${SITE_URL}/blog/page/${currentPage}/`;


  return {
    title: `SopKit Blog — Page ${currentPage} of ${totalPages}`,
    description:
      "Practical guides, tutorials, comparisons, and workflows for free online tools and everyday digital tasks.",
    alternates: { canonical },
    openGraph: {
      title: `SopKit Blog — Page ${currentPage}`,
      description:
        "Practical guides, tutorials, comparisons, and workflows for free online tools and everyday digital tasks.",
      url: canonical,
      siteName: "SopKit",
      images: [{ url: "/og-image.jpg" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `SopKit Blog — Page ${meta.currentPage}`,
      description:
        "Practical guides, tutorials, comparisons, and workflows for free online tools and everyday digital tasks.",
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

  const meta = getBlogArchiveMeta(parsedPage);
  if (currentPage !== parsedPage) {
    notFound();
  }

  return <BlogArchive currentPage={currentPage} />;
}
