import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFToWord from "@/components/tools/pdf/PDFToWord";

export const metadata = {
	title: "PDF to Word Online Free - Edit, Merge & Convert PDF | SopKit",
	description: "Convert PDF files to editable Word documents No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-to-word/",
	},
	openGraph: {
		title: "PDF to Word Online Free - No Signup",
		description: "Convert PDF files to editable Word documents No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/pdf-to-word/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PDF to Word Online Free - Fast & Secure",
		description: "Convert PDF files to editable Word documents No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-to-word");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFToWord />
		</ToolLayout>
	);
}
