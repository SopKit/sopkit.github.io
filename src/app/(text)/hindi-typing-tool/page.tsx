import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import HindiTypingTool from "@/components/tools/text/HindiTypingTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Hindi Typing Tool",
	description: "Private Hindi Typing: privately process text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/hindi-typing-tool",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/hindi-typing-tool");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<HindiTypingTool />
		</ToolLayout>
	);
}
