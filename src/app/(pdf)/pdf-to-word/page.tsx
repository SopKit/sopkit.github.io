import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFToWord from "@/components/tools/pdf/PDFToWord";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "PDF to Word",
	description: "Private PDF to Word: privately convert PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/pdf-to-word",
	category: "pdf",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-to-word");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFToWord />
		</ToolLayout>
	);
}
