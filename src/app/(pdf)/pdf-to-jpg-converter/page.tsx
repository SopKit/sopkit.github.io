import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFToImage from "@/components/tools/pdf/PDFToImage";

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-to-jpg-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<PDFToImage />
		</ToolLayout>
	);
}
