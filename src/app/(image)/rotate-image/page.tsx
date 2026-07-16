import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageResizerTool from "@/components/tools/image/ImageResizerTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Rotate Image",
	description: "Private Rotate Image: privately process images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/rotate-image",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/rotate-image");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageResizerTool />
		</ToolLayout>
	);
}
