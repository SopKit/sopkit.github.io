import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ScreenResolutionTool from "@/components/tools/built-ins/ScreenResolutionTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "What Is My Screen Resolution",
	description: "Private What Is My Screen Resolution: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/what-is-my-screen-resolution",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/what-is-my-screen-resolution");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ScreenResolutionTool />
		</ToolLayout>
	);
}
