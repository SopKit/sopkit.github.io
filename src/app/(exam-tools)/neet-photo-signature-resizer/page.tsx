import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "NEET Photo & Signature Resizer",
	description: "Private NEET Photo & Signature Resizer: privately compress exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/neet-photo-signature-resizer",
	category: "exam-tools",
});

export default function ToolPage() {
	const tool = getToolByRoute("/neet-photo-signature-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExamPhotoResizer examName="NEET" />
		</ToolLayout>
	);
}
