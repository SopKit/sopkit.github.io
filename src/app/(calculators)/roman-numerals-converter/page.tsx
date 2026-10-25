import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Roman Numerals Converter",
	description: "Convert numbers to Roman numerals and back instantly, including large numbers and historical formats — type a value and get the conversion, free in your browser with no signup.",
	route: "/roman-numerals-converter",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/roman-numerals-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
