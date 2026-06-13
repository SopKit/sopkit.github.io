import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";


export const metadata = {
	title: "SSC Photo and Signature Resizer Online Free | SopKit",
	description: "Resize and compress SSC photo (20-50KB) and signature (10-20KB) online for government exam forms. 100% compliant with SSC requirements. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/ssc-photo-signature-resizer",
	},
	openGraph: {
		title: "SSC Photo and Signature Resizer Online Free - No Signup | SopKit",
		description: "Resize and compress SSC photo (20-50KB) and signature (10-20KB) online for government exam forms. 100% compliant with SSC requirements. No signup, no uploads, 1",
		url: "https://sopkit.github.io/ssc-photo-signature-resizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "SSC Photo and Signature Resizer Online Free - Fast & Secure",
		description: "Resize and compress SSC photo (20-50KB) and signature (10-20KB) online for government exam forms. 100% compliant with SSC requirements. No signup, no uploads, 1",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/ssc-photo-signature-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExamPhotoResizer examName="SSC" />
		</ToolLayout>
	);
}
