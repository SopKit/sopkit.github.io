import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResizeImageCm from "@/components/tools/image/ResizeImageCm";

export default function ToolPage() {
	const tool = getToolByRoute("/resize-image-cm-mm-inch");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<ResizeImageCm />
		</ToolLayout>
	);
}
