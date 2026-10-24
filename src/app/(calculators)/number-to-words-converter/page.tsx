import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Number to Words Converter",
	description: "Type any number to see it written out in English words using the Indian numbering system, ready to copy onto cheques, invoices and official documents.",
	route: "/number-to-words-converter",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/number-to-words-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
