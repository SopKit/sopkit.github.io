import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "WebP to JPG Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert WebP images to JPG format for maximum compatibility across all devices and platforms. Our free online converter is fast, secure, and preserves image detail. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/webp-to-jpg-converter",
	},
	openGraph: {
		title: "WebP to JPG Converter Online Free - No Signup",
		description: "Convert WebP images to JPG format for maximum compatibility across all devices and platforms. Our free online converter is fast, secure, and preserves image det",
		url: "https://sopkit.github.io/webp-to-jpg-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "WebP to JPG Converter Online Free - Fast & Secure",
		description: "Convert WebP images to JPG format for maximum compatibility across all devices and platforms. Our free online converter is fast, secure, and preserves image det",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/webp-to-jpg-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<ImageConverterTool defaultOutputFormat="jpeg" />
		</ToolLayout>
	);
}
