import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFPageDelete from "@/components/tools/pdf/PDFPageDelete";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Remove Pages from PDF",
	description: "Private Remove Pages from PDF: privately process PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
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
