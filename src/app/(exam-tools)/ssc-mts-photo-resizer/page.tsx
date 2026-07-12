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
	title: "SSC MTS Photo Resizer - Resize Photo & Signature | SopKit",
	description: "Free online SSC MTS photo resizer tool. Resize passport photos to 3.5 x 4.5 cm (20KB - 50KB) and signatures to 10KB - 20KB. Browser-based, private, and fast.",
	alternates: { canonical: "https://sopkit.github.io/ssc-mts-photo-resizer/" },
	openGraph: {
		title: "SSC MTS Photo Resizer - Resize Photo & Signature | SopKit",
		description: "Resize and compress your passport photo and signature to meet the official SSC MTS online application requirements.",
		url: "https://sopkit.github.io/ssc-mts-photo-resizer/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "SSC MTS Photo Resizer - Resize Photo & Signature | SopKit",
		description: "Free browser-based photo resizer for SSC MTS forms. Private, quick, and meets all official criteria.",
		images: ["/og-image.jpg"]
	},
	robots: { index: true, follow: true }
};

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
