import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResizeImageCm from "@/components/tools/image/ResizeImageCm";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Image DPI Converter",
	description: "Private Image DPI Converter: privately convert images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/image-dpi-converter",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/image-dpi-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ResizeImageCm defaultUnit="inch" defaultDpi="300" />
		</ToolLayout>
	);
}
