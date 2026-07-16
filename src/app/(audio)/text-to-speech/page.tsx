import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextToSpeechTool from "@/components/tools/audio/TextToSpeechTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Text to Speech",
	description: "Private Text to Speech: privately convert audio files entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/text-to-speech",
	category: "audio",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/text-to-speech");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextToSpeechTool />
		</ToolLayout>
	);
}
