import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AudioEqualizerTool from "@/components/tools/audio/AudioEqualizerTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Audio Equalizer",
	description: "Private Audio Equalizer: privately adjust audio frequencies entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/audio-equalizer",
	category: "audio",
});

export default function ToolPage() {
	const tool = getToolByRoute("/audio-equalizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AudioEqualizerTool />
		</ToolLayout>
	);
}
