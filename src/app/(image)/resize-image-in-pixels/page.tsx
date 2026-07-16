import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResizeImageCm from "@/components/tools/image/ResizeImageCm";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Resize Image in Pixels",
	description: "Private Resize Image in Pixels: privately process images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/resize-image-in-pixels",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/resize-image-in-pixels");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ResizeImageCm defaultUnit="px" />
		</ToolLayout>
	);
}
