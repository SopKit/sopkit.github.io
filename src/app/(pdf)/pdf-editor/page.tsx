import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFEditor from "@/components/tools/pdf/PDFEditor";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "PDF Editor",
	description: "Upload a PDF, click any page to add a text annotation, then adjust its wording, size and colour before saving the annotated PDF. Free, no signup.",
	route: "/pdf-editor",
	category: "pdf",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-editor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFEditor />
		</ToolLayout>
	);
}
