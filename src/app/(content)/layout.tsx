import { buildCanonicalUrl } from "@/seo/canonical";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blog & Guides | SopKit",
	description:
		"Practical guides, step-by-step tutorials, and tool comparisons from SopKit. Learn how to compress images, merge PDFs, download videos, and optimize SEO.",
	openGraph: {
		title: "Blog & Guides | SopKit",
		description:
			"Practical guides, tutorials, and tool comparisons for free online productivity tools. Compress images, merge PDFs, download videos, and optimize SEO.",
		url: buildCanonicalUrl("/blog"),
		siteName: "SopKit",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Blog & Guides | SopKit",
		description:
			"Practical guides, tutorials, and tool comparisons for free online productivity tools. Compress images, merge PDFs, download videos, and optimize SEO.",
	},
};

export default function ContentGroupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
			<main className="flex-1">{children}</main>
		</div>
	);
}
