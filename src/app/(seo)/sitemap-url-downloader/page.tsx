import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SitemapUrlDownloader from "@/components/tools/downloaders/SitemapUrlDownloader";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Sitemap Url Downloader",
	description: "Private Sitemap Url Downloader: privately download website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/sitemap-url-downloader",
	category: "seo",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/sitemap-url-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SitemapUrlDownloader />
		</ToolLayout>
	);
}
