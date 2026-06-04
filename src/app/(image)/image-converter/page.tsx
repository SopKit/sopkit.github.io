import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "Image Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert images between any format (PNG, JPG, WEBP, BMP, GIF, SVG) online for free. Fast, high-quality conversion with batch support and 100% privacy. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/image-converter",
	},
	openGraph: {
		title: "Image Converter Online Free - No Signup",
		description: "Convert images between any format (PNG, JPG, WEBP, BMP, GIF, SVG) online for free. Fast, high-quality conversion with batch support and 100% privacy. No signup,",
		url: "https://sopkit.github.io/image-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Image Converter Online Free - Fast & Secure",
		description: "Convert images between any format (PNG, JPG, WEBP, BMP, GIF, SVG) online for free. Fast, high-quality conversion with batch support and 100% privacy. No signup,",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/image-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<ImageConverterTool />
		</ToolLayout>
	);
}
