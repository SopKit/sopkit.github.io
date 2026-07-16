import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "UPSC Photo Resizer 350x350",
	description: "Private UPSC Photo Resizer 350x350: privately compress exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/upsc-photo-resizer-350x350",
	category: "exam-tools",
});

export default function ToolPage() {
	const tool = getToolByRoute("/upsc-photo-resizer-350x350");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExamPhotoResizer examName="UPSC" presetWidth={350} presetHeight={350} />
		</ToolLayout>
	);
}
