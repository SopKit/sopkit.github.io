import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import GuitarTunerTool from "@/components/tools/audio/GuitarTunerTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Guitar Tuner",
	description: "Private Guitar Tuner: privately process audio files entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/guitar-tuner",
	category: "audio",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/guitar-tuner");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<GuitarTunerTool />
		</ToolLayout>
	);
}
