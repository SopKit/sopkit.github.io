import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "HTML Decoder",
	description: "Private HTML Decoder: privately convert code and data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/html-decoder",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/html-decoder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="html-decoder" />
		</ToolLayout>
	);
}
