import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import URLShortenerTool from "@/components/tools/utilities/URLShortenerTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "URL Shortener",
	description: "Private URL Shortener: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/url-shortener",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/url-shortener");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<URLShortenerTool />
		</ToolLayout>
	);
}
