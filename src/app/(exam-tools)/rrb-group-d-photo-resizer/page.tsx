import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute, getToolById } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";

const relatedToolIds = [
	"ssc-photo-resizer",
	"signature-resizer-under-20kb",
	"railway-exam-photo-resizer",
	"pan-card-photo-resizer",
	"photo-compressor-under-50kb",
	"compress-image-to-20kb",
	"pdf-compressor-under-200kb"
];

export const metadata = {
	title: "RRB Group D Photo Resizer - Resize Photo & Signature | SopKit",
	description: "Free online RRB Group D photo resizer tool. Resize passport photos and signatures to match Indian Railways requirements. Browser-based, private, and fast.",
	alternates: { canonical: "https://sopkit.github.io/rrb-group-d-photo-resizer/" },
	openGraph: {
		title: "RRB Group D Photo Resizer - Resize Photo & Signature | SopKit",
		description: "Resize and compress your passport photo and signature to meet the official RRB Group D / Railway exam application specifications.",
		url: "https://sopkit.github.io/rrb-group-d-photo-resizer/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "RRB Group D Photo Resizer - Resize Photo & Signature | SopKit",
		description: "Free browser-based photo resizer for Railway RRB Group D forms. Private, quick, and meets all official criteria.",
		images: ["/og-image.jpg"]
	},
	robots: { index: true, follow: true }
};

export default async function RrbGroupDResizerPage() {
	const tool = getToolByRoute("/rrb-group-d-photo-resizer");
	if (!tool) return notFound();

	const relatedTools = relatedToolIds
		.map(getToolById)
		.filter((t): t is NonNullable<typeof t> => Boolean(t));

	return (
		<ToolLayout breadcrumbs={[]} tool={tool} relatedTools={relatedTools}>
			<ExamPhotoResizer examName="Railway" />
		</ToolLayout>
	);
}
