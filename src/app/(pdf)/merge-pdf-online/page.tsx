import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFMerger from "@/components/tools/pdf/PDFMerger";

export default function ToolPage() {
	const tool = getToolByRoute("/merge-pdf-online");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<PDFMerger />
		</ToolLayout>
	);
}
