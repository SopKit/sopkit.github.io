import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BrowserDetectTool from "@/components/tools/built-ins/BrowserDetectTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "What Is My Browser",
	description: "Private What Is My Browser: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/what-is-my-browser",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/what-is-my-browser");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BrowserDetectTool />
		</ToolLayout>
	);
}
