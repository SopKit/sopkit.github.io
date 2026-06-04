import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SitemapGeneratorTool from "@/components/tools/seo/SitemapGeneratorTool";

export const metadata = {
	title: "Robots.txt and Sitemap Generator Free Online - No Signup | SopKit",
	description: "Free Robots.txt and Sitemap Generator online. Generate search engine friendly robots.txt and sitemap.xml files for your website to improve crawling and indexing. 100% free, no signup required.",
	alternates: {
		canonical: "https://sopkit.github.io/robots-txt-sitemap-generator",
	},
	openGraph: {
		title: "Robots.txt and Sitemap Generator Online Free - No Signup",
		description: "Free Robots.txt and Sitemap Generator online. Generate search-engine friendly robots.txt and sitemap.xml files for your website to improve crawling and indexing.",
		url: "https://sopkit.github.io/robots-txt-sitemap-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Robots.txt and Sitemap Generator Online Free - Fast & Secure",
		description: "Free Robots.txt and Sitemap Generator online. Generate search-engine friendly robots.txt and sitemap.xml files for your website to improve crawling and indexing.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/robots-txt-sitemap-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<SitemapGeneratorTool />
		</ToolLayout>
	);
}
