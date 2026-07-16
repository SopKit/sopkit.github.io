import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Compress Image to 20KB",
	description: "Private Compress Image to 20KB: privately compress images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/compress-image-to-20kb",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/compress-image-to-20kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExamPhotoResizer
				examName="20KB Limit"
				presetWidth={350}
				presetHeight={350}
				presetMinKb={5}
				presetMaxKb={20}
				showSignatureOption={false}
				disclaimer="Compress your images to exactly under 20KB for online form portals."
			/>
		</ToolLayout>
	);
}
