import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JpgToPdfExam from "@/components/tools/exam/JpgToPdfExam";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "JPG to PDF for Exam Forms",
	description: "Private JPG to PDF for Exam Forms: privately convert exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/jpg-to-pdf-exam-forms",
	category: "exam-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/jpg-to-pdf-exam-forms");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JpgToPdfExam />
		</ToolLayout>
	);
}
