import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageToPDF from "@/components/tools/pdf/ImageToPDF";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Image to PDF",
	description: "Upload one or more images, arrange their order and set A4 orientation and margins to combine them into a single downloadable PDF. Free, no signup.",
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
