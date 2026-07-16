import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PdfCompressor200kb from "@/components/tools/exam/PdfCompressor200kb";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "PDF Compressor Under 200KB",
	description: "Private PDF Compressor Under 200KB: privately compress exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/pdf-compressor-under-200kb",
	category: "exam-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-compressor-under-200kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PdfCompressor200kb />
		</ToolLayout>
	);
}
