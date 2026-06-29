import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageToPDF from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "Image to PDF Online Free - Edit, Merge & Convert PDF | SopKit",
	description: "Convert multiple images to a single PDF document 100% free. Supports JPG, PNG, WEBP and more. Privacy-first local processing with no signup required. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/image-to-pdf/",
	},
	openGraph: {
		title: "Image to PDF Online Free - No Signup",
		description: "Convert multiple images to a single PDF document 100% free. Supports JPG, PNG, WEBP and more. Privacy-first local processing with no signup required. No signup,",
		url: "https://sopkit.github.io/image-to-pdf",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Image to PDF Online Free - Fast & Secure",
		description: "Convert multiple images to a single PDF document 100% free. Supports JPG, PNG, WEBP and more. Privacy-first local processing with no signup required. No signup,",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/image-to-pdf");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageToPDF />
		</ToolLayout>
	);
}
