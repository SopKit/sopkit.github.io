import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";


export const metadata = {
	title: "NEET Photo & Signature Resizer Online Free | SopKit",
	description: "Resize and compress NEET photo and signature for application forms. Adjust size, dimensions, format, and file limit online. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/neet-photo-signature-resizer/",
	},
	openGraph: {
		title: "NEET Photo & Signature Resizer Online Free - No Signup | SopKit",
		description: "Resize and compress NEET photo and signature for application forms. Adjust size, dimensions, format, and file limit online. No signup, no uploads, 100% private ",
		url: "https://sopkit.github.io/neet-photo-signature-resizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "NEET Photo & Signature Resizer Online Free - Fast & Secure",
		description: "Resize and compress NEET photo and signature for application forms. Adjust size, dimensions, format, and file limit online. No signup, no uploads, 100% private ",
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
