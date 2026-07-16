import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64ToImageTool from "@/components/tools/image/Base64ToImageTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Base64 to Image Converter",
	description: "Private Base64 to Image Converter: privately convert images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/base64-to-image-converter",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/base64-to-image-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<Base64ToImageTool />
		</ToolLayout>
	);
}
