import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageToPDF from "@/components/tools/pdf/ImageToPDF";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Image to PDF",
	description: "Private Image to PDF: privately convert PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/image-to-pdf",
	category: "pdf",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/image-to-pdf");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageToPDF />
		</ToolLayout>
	);
}
