import type { Metadata } from "next";
import BlogArchive from "@/components/content/BlogArchive";
import { SITE_URL } from "@/constants/config";

export const metadata: Metadata = {
  title: "SopKit Blog — Guides, Tutorials & Tool Tips",
  description:
    "Practical guides, tutorials, comparisons, and workflows for free online tools, developer utilities, SEO, PDFs, images, and everyday productivity.",
  keywords:
    "SopKit blog, free online tools guides, SEO tutorials, developer guides, PDF tutorials, image optimization, JSON guides, productivity tools",
  alternates: { canonical: `${SITE_URL}/blog/` },
  openGraph: {
    title: "SopKit Blog — Guides, Tutorials & Tool Tips",
    description:
      "Practical guides, tutorials, comparisons, and workflows for free online tools and everyday digital tasks.",
    url: `${SITE_URL}/blog/`,
    siteName: "SopKit",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
