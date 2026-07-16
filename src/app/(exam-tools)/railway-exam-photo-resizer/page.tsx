import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Railway Exam Photo Resizer",
	description: "Private Railway Exam Photo Resizer: privately process exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/railway-exam-photo-resizer",
	category: "exam-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/railway-exam-photo-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExamPhotoResizer examName="Railway" />
		</ToolLayout>
	);
}
