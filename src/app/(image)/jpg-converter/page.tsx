import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "JPG Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert photos and images to JPG format instantly. Our free online JPG converter maintains high visual quality while optimizing file size for web use. Privacy-focused and works entirely in your browser. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/jpg-converter",
	},
	openGraph: {
		title: "JPG Converter Online Free - No Signup",
		description: "Convert photos and images to JPG format instantly. Our free online JPG converter maintains high visual quality while optimizing file size for web use. Privacy-f",
		url: "https://sopkit.github.io/jpg-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JPG Converter Online Free - Fast & Secure",
		description: "Convert photos and images to JPG format instantly. Our free online JPG converter maintains high visual quality while optimizing file size for web use. Privacy-f",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/jpg-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="jpeg" />
		</ToolLayout>
	);
}
