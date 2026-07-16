import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeTitleLengthCheckerTool from "@/components/tools/youtube/YouTubeTitleLengthCheckerTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "YouTube Title Length Checker",
	description: "Private YouTube Title Length Checker: privately validate YouTube content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/youtube-title-length-checker",
	category: "youtube",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-title-length-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeTitleLengthCheckerTool />
		</ToolLayout>
	);
}
