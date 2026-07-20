import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import AiVideoSummarizerTool from "@/components/tools/video/AiVideoSummarizerTool";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Video Summarizer",
	description: "Private AI Video Summarizer: summarize video transcripts entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/ai-video-summarizer",
	category: "video",
});

export default function ToolPage() {
	const tool = getToolByRoute("/ai-video-summarizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AiVideoSummarizerTool />
		</ToolLayout>
	);
}
