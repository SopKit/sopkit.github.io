import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PanCardResizer from "@/components/tools/exam/PanCardResizer";

export default function ToolPage() {
	const tool = getToolByRoute("/aadhaar-pan-photo-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<PanCardResizer />
		</ToolLayout>
	);
}
