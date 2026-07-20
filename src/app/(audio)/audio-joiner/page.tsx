import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AudioJoinerTool from "@/components/tools/audio/AudioJoinerTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Audio Joiner",
	description: "Private Audio Joiner: privately combine multiple audio files into one entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/audio-joiner",
	category: "audio",
});

export default function ToolPage() {
	const tool = getToolByRoute("/audio-joiner");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AudioJoinerTool />
		</ToolLayout>
	);
}
