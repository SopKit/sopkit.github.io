import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import VideoConverterTool from "@/components/tools/video/VideoConverterTool";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Video Converter",
	description: "Private Video Converter: privately convert videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/video-converter",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/video-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<VideoConverterTool />
		</ToolLayout>
	);
}
