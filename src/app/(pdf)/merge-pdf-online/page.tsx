import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFMerger from "@/components/tools/pdf/PDFMerger";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Merge PDF Online",
	description: "Private Merge PDF: privately process PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
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
