import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFPageDelete from "@/components/tools/pdf/PDFPageDelete";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Remove Pages from PDF",
	description: "Upload a PDF, preview its pages and select the ones to drop, then download the remaining document as a new PDF. Free, no signup, and your files stay in your browser.",
	route: "/remove-pages-from-pdf",
	category: "pdf",
});

export default function ToolPage() {
	const tool = getToolByRoute("/remove-pages-from-pdf");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFPageDelete />
		</ToolLayout>
	);
}
