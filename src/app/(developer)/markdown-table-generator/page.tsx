import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import MarkdownTableGenerator from "@/components/tools/developer/MarkdownTableGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Markdown Table Generator",
	description: "Easily generate clean, formatted Markdown tables using an interactive spreadsheet visual editor. Customize column alignment, add rows, and copy syntax instantly.",
	route: "/markdown-table-generator",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/markdown-table-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<MarkdownTableGenerator />
		</ToolLayout>
	);
}
