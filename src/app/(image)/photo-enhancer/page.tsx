import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PhotoEnhancerTool from "@/components/tools/image/PhotoEnhancerTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Photo Enhancer",
	description: "Private Photo Enhancer: privately process images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/photo-enhancer",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/photo-enhancer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PhotoEnhancerTool />
		</ToolLayout>
	);
}
