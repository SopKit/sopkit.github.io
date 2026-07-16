import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "JavaScript Beautifier",
	description: "Private JavaScript Beautifier: privately format code and data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/javascript-beautifier",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/javascript-beautifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="javascript-beautifier" />
		</ToolLayout>
	);
}
