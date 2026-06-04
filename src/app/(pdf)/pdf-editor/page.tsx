import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFEditor from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "PDF Editor Online Free - Edit, Merge & Convert PDF | SopKit",
	description: "Professional PDF editor - edit text, add annotations, rotate, and delete pages online for free. Secure, 100% browser-based PDF editing with no signup. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-editor",
	},
	openGraph: {
		title: "PDF Editor Online Free - No Signup",
		description: "Professional PDF editor - edit text, add annotations, rotate, and delete pages online for free. Secure, 100% browser-based PDF editing with no signup. No signup",
		url: "https://sopkit.github.io/pdf-editor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PDF Editor Online Free - Fast & Secure",
		description: "Professional PDF editor - edit text, add annotations, rotate, and delete pages online for free. Secure, 100% browser-based PDF editing with no signup. No signup",
		images: ["/og-image.jpg"],
	},
	robots: { index: false, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-editor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<PDFEditor />
		</ToolLayout>
	);
}
