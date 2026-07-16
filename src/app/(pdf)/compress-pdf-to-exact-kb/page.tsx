import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFCompressor from "@/components/tools/pdf/PDFCompressor";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Compress PDF to Exact KB",
	description: "Private Compress PDF to Exact KB: privately compress PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/compress-pdf-to-exact-kb",
	category: "pdf",
});

export default function ToolPage() {
	const tool = getToolByRoute("/compress-pdf-to-exact-kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFCompressor />
		</ToolLayout>
	);
}
