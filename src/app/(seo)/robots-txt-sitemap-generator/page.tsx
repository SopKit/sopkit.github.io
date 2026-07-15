import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SitemapGeneratorTool from "@/components/tools/seo/SitemapGeneratorTool";

export const metadata = {
	title: "Free Robots.txt and Sitemap Generator Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Robots.txt and Sitemap Generator online. Optimize search presence with no signup.",
	keywords: "robots.txt and sitemap generator, free online tool, no signup, robots.txt and sitemap generator online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/robots-txt-sitemap-generator",
	},
	openGraph: {
		title: "Free Robots.txt and Sitemap Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Robots.txt and Sitemap Generator online. Optimize search presence with no signup.",
		url: "https://sopkit.github.io/robots-txt-sitemap-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Robots.txt and Sitemap Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Robots.txt and Sitemap Generator online. Optimize search presence with no signup.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SitemapGeneratorTool />
		</ToolLayout>
	);
}
