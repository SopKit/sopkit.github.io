import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Compress Image to 100KB",
	description: "Private Compress Image to 100KB: privately compress images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/compress-image-to-100kb",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/compress-image-to-100kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExamPhotoResizer
				examName="100KB Limit"
				presetWidth={600}
				presetHeight={600}
				presetMinKb={10}
				presetMaxKb={100}
				showSignatureOption={false}
				disclaimer="Compress your images to exactly under 100KB for online form portals."
			/>
		</ToolLayout>
	);
}
