import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CSSGradientTool from "@/components/tools/developer/CSSGradientTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "CSS Gradient Generator",
	description: "Private CSS Gradient: privately generate code and data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/css-gradient-generator",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/css-gradient-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CSSGradientTool />
		</ToolLayout>
	);
}
