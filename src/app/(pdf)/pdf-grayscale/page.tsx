import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFGrayscale from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "PDF Grayscale Online Free - Edit, Merge & Convert PDF | SopKit",
	description: "Convert color PDF documents to black and white (grayscale) online for free. Reduce file size and save ink with our secure, browser-based PDF converter. No signup required. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-grayscale",
	},
	openGraph: {
		title: "PDF Grayscale Online Free - No Signup",
		description: "Convert color PDF documents to black and white (grayscale) online for free. Reduce file size and save ink with our secure, browser-based PDF converter. No signu",
		url: "https://sopkit.github.io/pdf-grayscale",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PDF Grayscale Online Free - Fast & Secure",
		description: "Convert color PDF documents to black and white (grayscale) online for free. Reduce file size and save ink with our secure, browser-based PDF converter. No signu",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-grayscale");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFGrayscale />
		</ToolLayout>
	);
}
