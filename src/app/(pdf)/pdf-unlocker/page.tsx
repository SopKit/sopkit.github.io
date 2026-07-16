import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFUnlock from "@/components/tools/pdf/PDFUnlock";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "PDF Unlocker",
	description: "Private PDF Unlocker: privately process PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/pdf-unlocker",
	category: "pdf",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-unlocker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFUnlock />
		</ToolLayout>
	);
}
