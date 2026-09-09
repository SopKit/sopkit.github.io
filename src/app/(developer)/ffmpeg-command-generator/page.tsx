import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FfmpegCommandGenerator from "@/components/tools/developer/FfmpegCommandGenerator";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "FFmpeg Command Generator",
	description:
		"Generate FFmpeg commands for video conversion, compression, trimming, GIF creation, audio extraction, and common encoding workflows with codec, bitrate, resolution, and filter controls.",
	route: "/ffmpeg-command-generator",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ffmpeg-command-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FfmpegCommandGenerator />
		</ToolLayout>
	);
}
