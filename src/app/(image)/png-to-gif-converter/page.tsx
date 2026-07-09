import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "PNG to GIF Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert PNG photos to GIF format instantly. Perfect for web graphics and simple animations. Free, secure, and works entirely in your browser without file uploads. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/png-to-gif-converter/",
	},
	openGraph: {
		title: "PNG to GIF Converter Online Free - No Signup",
		description: "Convert PNG photos to GIF format instantly. Perfect for web graphics and simple animations. Free, secure, and works entirely in your browser without file upload",
		url: "https://sopkit.github.io/png-to-gif-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PNG to GIF Converter Online Free - Fast & Secure",
		description: "Convert PNG photos to GIF format instantly. Perfect for web graphics and simple animations. Free, secure, and works entirely in your browser without file upload",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/png-to-gif-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="png" />
		</ToolLayout>
	);
}
