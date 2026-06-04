import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFPageDelete from "@/components/tools/pdf/PDFPageDelete";

export default function ToolPage() {
	const tool = getToolByRoute("/remove-pages-from-pdf");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<PDFPageDelete />
		</ToolLayout>
	);
}
