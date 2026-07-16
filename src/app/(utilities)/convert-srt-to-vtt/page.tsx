import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextCompareTool from "@/components/tools/text/TextCompareTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Convert SRT to VTT",
	description: "Private Convert SRT to VTT: privately convert web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/convert-srt-to-vtt",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/convert-srt-to-vtt");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextCompareTool />
		</ToolLayout>
	);
}
