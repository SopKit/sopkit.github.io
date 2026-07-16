import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UrlCodecTool from "@/components/tools/built-ins/UrlCodecTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "URL Encode",
	description: "Private URL Encode: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/url-encode",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/url-encode");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UrlCodecTool mode="encode" />
		</ToolLayout>
	);
}
