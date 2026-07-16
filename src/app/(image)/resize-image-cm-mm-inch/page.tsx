import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResizeImageCm from "@/components/tools/image/ResizeImageCm";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Resize Image in CM, MM, Inches",
	description: "Private Resize Image in CM, MM, Inches: privately process images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/resize-image-cm-mm-inch",
	category: "image",
});

export default function ToolPage() {
	const tool = getToolByRoute("/resize-image-cm-mm-inch");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ResizeImageCm />
		</ToolLayout>
	);
}
