import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFToImage from "@/components/tools/pdf/PDFToImage";


export const metadata = {
	title: "PDF to JPG Converter Online Free | SopKit",
	description: "Convert PDF pages to high-quality JPG images online. Download each page as an image or ZIP file. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-to-jpg-converter/",
	},
	openGraph: {
		title: "PDF to JPG Converter Online Free - No Signup | SopKit",
		description: "Convert PDF pages to high-quality JPG images online. Download each page as an image or ZIP file. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/pdf-to-jpg-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PDF to JPG Converter Online Free - Fast & Secure",
		description: "Convert PDF pages to high-quality JPG images online. Download each page as an image or ZIP file. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-to-jpg-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFToImage />
		</ToolLayout>
	);
}
