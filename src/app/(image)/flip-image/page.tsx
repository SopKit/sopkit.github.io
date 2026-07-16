import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageResizerTool from "@/components/tools/image/ImageResizerTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Flip Image",
	description: "Private Flip Image: privately process images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/flip-image",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/flip-image");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageResizerTool />
		</ToolLayout>
	);
}
