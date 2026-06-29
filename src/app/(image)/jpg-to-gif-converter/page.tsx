import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "JPG to GIF Converter Online Free - Compress & Convert Images | SopKit",
	description: "Turn your JPG photos into GIF format instantly. Perfect for simple animations or platform-specific requirements. Free, secure, and privacy-friendly online image converter. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/jpg-to-gif-converter/",
	},
	openGraph: {
		title: "JPG to GIF Converter Online Free - No Signup",
		description: "Turn your JPG photos into GIF format instantly. Perfect for simple animations or platform-specific requirements. Free, secure, and privacy-friendly online image",
		url: "https://sopkit.github.io/jpg-to-gif-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JPG to GIF Converter Online Free - Fast & Secure",
		description: "Turn your JPG photos into GIF format instantly. Perfect for simple animations or platform-specific requirements. Free, secure, and privacy-friendly online image",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/jpg-to-gif-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="jpeg" />
		</ToolLayout>
	);
}
