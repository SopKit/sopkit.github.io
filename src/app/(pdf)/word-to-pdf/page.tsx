import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WordToPDF from "@/components/tools/pdf/WordToPDF";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Word to PDF",
	description: "Private Word to PDF: privately convert PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/word-to-pdf",
	category: "pdf",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/word-to-pdf");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<WordToPDF />
		</ToolLayout>
	);
}
