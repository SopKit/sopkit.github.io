import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageToBase64Tool from "@/components/tools/image/ImageToBase64Tool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Image to Base64 Converter",
	description: "Privacy-friendly, 100% client-side Image to Base64 Converter. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/image-to-base64-converter",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/image-to-base64-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageToBase64Tool />
		</ToolLayout>
	);
}
