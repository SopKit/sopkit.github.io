import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";


export const metadata = {
	title: "Free NEET Photo & Signature Resizer Online - No Signup | SopKit",
	description: "Resize and compress files with our free NEET Photo & Signature Resizer online. Safe and private browser utility for government exam portal applications.",
	keywords: "neet photo & signature resizer, free online tool, no signup, neet photo & signature resizer online, exam-tools, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/neet-photo-signature-resizer",
	},
	openGraph: {
		title: "Free NEET Photo & Signature Resizer Online - No Signup | SopKit",
		description: "Resize and compress files with our free NEET Photo & Signature Resizer online. Safe and private browser utility for government exam portal applications.",
		url: "https://sopkit.github.io/neet-photo-signature-resizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free NEET Photo & Signature Resizer Online - No Signup | SopKit",
		description: "Resize and compress files with our free NEET Photo & Signature Resizer online. Safe and private browser utility for government exam portal applications.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

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
