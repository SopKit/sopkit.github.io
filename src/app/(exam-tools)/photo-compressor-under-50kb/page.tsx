import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PhotoCompressor50kb from "@/components/tools/exam/PhotoCompressor50kb";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Photo Compressor Under 50KB",
	description: "Private Photo Compressor Under 50KB: privately compress exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/photo-compressor-under-50kb",
	category: "exam-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/photo-compressor-under-50kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PhotoCompressor50kb />
		</ToolLayout>
	);
}
