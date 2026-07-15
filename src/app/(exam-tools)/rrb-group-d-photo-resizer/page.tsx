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
	title: "Free RRB Group D Photo Resizer Online - No Signup | SopKit",
	description: "Resize and compress files with our free RRB Group D Photo Resizer online. Safe and private browser utility for government exam portal applications. Easy to use.",
	keywords: "rrb group d photo resizer, free online tool, no signup, rrb group d photo resizer online, exam-tools, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/rrb-group-d-photo-resizer",
	},
	openGraph: {
		title: "Free RRB Group D Photo Resizer Online - No Signup | SopKit",
		description: "Resize and compress files with our free RRB Group D Photo Resizer online. Safe and private browser utility for government exam portal applications. Easy to use.",
		url: "https://sopkit.github.io/rrb-group-d-photo-resizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free RRB Group D Photo Resizer Online - No Signup | SopKit",
		description: "Resize and compress files with our free RRB Group D Photo Resizer online. Safe and private browser utility for government exam portal applications. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
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
