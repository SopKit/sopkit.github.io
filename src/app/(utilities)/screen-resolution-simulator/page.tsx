import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ScreenResolutionTool from "@/components/tools/built-ins/ScreenResolutionTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Screen Resolution Simulator",
	description: "Private Screen Resolution Simulator: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/screen-resolution-simulator",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/screen-resolution-simulator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ScreenResolutionTool />
		</ToolLayout>
	);
}
