import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute, getToolById } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";
import { generateToolMetadata } from "@/lib/seo";

const relatedToolIds = [
	"ssc-photo-resizer",
	"signature-resizer-under-20kb",
	"railway-exam-photo-resizer",
	"pan-card-photo-resizer",
	"photo-compressor-under-50kb",
	"compress-image-to-20kb",
	"pdf-compressor-under-200kb"
];

export const metadata = generateToolMetadata({
	name: "SSC MTS Photo Resizer",
	description: "Private SSC MTS Photo Resizer: privately convert exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/ssc-mts-photo-resizer",
	category: "exam-tools",
});

export default async function SscMtsResizerPage() {
	const tool = getToolByRoute("/ssc-mts-photo-resizer");
	if (!tool) return notFound();

	const relatedTools = relatedToolIds
		.map(getToolById)
		.filter((t): t is NonNullable<typeof t> => Boolean(t));

	return (
		<ToolLayout breadcrumbs={[]} tool={tool} relatedTools={relatedTools}>
			<ExamPhotoResizer examName="SSC" />
		</ToolLayout>
	);
}
