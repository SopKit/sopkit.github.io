import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFUnlock from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "PDF Unlocker Online Free - Edit, Merge & Convert PDF | SopKit",
	description: "Remove password protection from PDF files No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-unlocker",
	},
	openGraph: {
		title: "PDF Unlocker Online Free - No Signup",
		description: "Remove password protection from PDF files No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/pdf-unlocker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PDF Unlocker Online Free - Fast & Secure",
		description: "Remove password protection from PDF files No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-unlocker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<PDFUnlock />
		</ToolLayout>
	);
}
