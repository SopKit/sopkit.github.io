import type { Metadata } from "next";
import BlogArchive from "@/components/content/BlogArchive";
import { buildCanonicalUrl } from "@/seo/canonical";

export const metadata: Metadata = {
  title: "SopKit Blog — Guides, Tutorials & Tool Tips",
  description:
    "Practical guides, tutorials, comparisons, and workflows for free online tools, developer utilities, SEO, PDFs, images, and everyday productivity.",
  alternates: { canonical: buildCanonicalUrl("/blog") },
  openGraph: {
    title: "SopKit Blog — Guides, Tutorials & Tool Tips",
    description:
      "Practical guides, tutorials, comparisons, and workflows for free online tools and everyday digital tasks.",
    url: buildCanonicalUrl("/blog"),
    siteName: "SopKit",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sopkit",
    title: "SopKit Blog — Guides, Tutorials & Tool Tips",
    description:
      "Practical guides, tutorials, comparisons, and workflows for free online tools and everyday digital tasks.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  return <BlogArchive currentPage={1} />;
}
