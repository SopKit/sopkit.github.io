import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Compress Image to 200KB",
	description: "Private Compress Image to 200KB: privately compress images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/compress-image-to-200kb",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/compress-image-to-200kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExamPhotoResizer
				examName="200KB Limit"
				presetWidth={800}
				presetHeight={800}
				presetMinKb={20}
				presetMaxKb={200}
				showSignatureOption={false}
				disclaimer="Compress your images to exactly under 200KB for online form portals."
			/>
		</ToolLayout>
	);
}
