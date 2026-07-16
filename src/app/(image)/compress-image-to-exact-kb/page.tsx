import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageCompressorTool from "@/components/tools/image/ImageCompressorTool";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Compress Image to Exact KB",
	description: "Private Compress Image to Exact KB: privately compress images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/compress-image-to-exact-kb",
	category: "image",
});

export default function ToolPage() {
	const tool = getToolByRoute("/compress-image-to-exact-kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageCompressorTool />
		</ToolLayout>
	);
}
