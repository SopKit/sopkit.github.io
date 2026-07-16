import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFEditor from "@/components/tools/pdf/PDFEditor";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "PDF Editor",
	description: "Private PDF Editor: privately process PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
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
