import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFCompressor from "@/components/tools/pdf/PDFCompressor";

export default function ToolPage() {
	const tool = getToolByRoute("/compress-pdf-to-exact-kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<PDFCompressor />
		</ToolLayout>
	);
}
