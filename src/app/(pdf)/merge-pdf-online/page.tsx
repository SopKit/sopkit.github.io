import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFMerger from "@/components/tools/pdf/PDFMerger";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Merge PDF Online",
	description: "Merge PDF files online for free: combine multiple PDFs into one file, arrange the page order and download the result instantly. Files are processed in your browser with no uploads and no signup.",
	route: "/merge-pdf-online",
	category: "pdf",
});

export default function ToolPage() {
	const tool = getToolByRoute("/merge-pdf-online");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFMerger />
		</ToolLayout>
	);
}
