import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFToImage from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "PDF to Image Online Free - Edit, Merge & Convert PDF | SopKit",
	description: "Convert PDF pages to high-quality JPG, PNG images No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-to-image",
	},
	openGraph: {
		title: "PDF to Image Online Free - No Signup",
		description: "Convert PDF pages to high-quality JPG, PNG images No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/pdf-to-image",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PDF to Image Online Free - Fast & Secure",
		description: "Convert PDF pages to high-quality JPG, PNG images No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-to-image");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFToImage />
		</ToolLayout>
	);
}
