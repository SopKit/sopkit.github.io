import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";

export const metadata = {
	title: "Free Bank Exam Photo Resizer Online - No Signup | SopKit",
	description: "Resize and compress files with our free Bank Exam Photo Resizer online. Safe and private browser utility for government exam portal applications. Free & secure.",
	keywords: "ibps-photo-resizer, IBPS Photo Resizer, ibps photo resizer online, ibps photo compressor, ibps signature resize, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ibps-photo-resizer",
	},
	openGraph: {
		title: "Free Bank Exam Photo Resizer Online - No Signup | SopKit",
		description: "Resize and compress files with our free Bank Exam Photo Resizer online. Safe and private browser utility for government exam portal applications. Free & secure.",
		url: "https://sopkit.github.io/ibps-photo-resizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Bank Exam Photo Resizer Online - No Signup | SopKit",
		description: "Resize and compress files with our free Bank Exam Photo Resizer online. Safe and private browser utility for government exam portal applications. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ibps-photo-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExamPhotoResizer examName="IBPS" />
		</ToolLayout>
	);
}
