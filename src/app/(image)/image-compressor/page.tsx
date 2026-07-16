import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageCompressorTool from "@/components/tools/image/ImageCompressorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Image Compressor",
	description: "Private Image Compressor: privately compress images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/image-compressor",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/image-compressor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageCompressorTool />
		</ToolLayout>
	);
}
