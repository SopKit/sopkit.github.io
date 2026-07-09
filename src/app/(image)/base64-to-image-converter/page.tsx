import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64ToImageTool from "@/components/tools/image/Base64ToImageTool";

export const metadata = {
	title: "Base64 to Image Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert Base64 strings to images (PNG, JPG, WebP) instantly. Our privacy-first tool processes data locally in your browser, ensuring your images stay secure. Free and fast Base64 decoder. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/base64-to-image-converter/",
	},
	openGraph: {
		title: "Base64 to Image Converter Online Free - No Signup",
		description: "Convert Base64 strings to images (PNG, JPG, WebP) instantly. Our privacy-first tool processes data locally in your browser, ensuring your images stay secure. Fr",
		url: "https://sopkit.github.io/base64-to-image-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Base64 to Image Converter Online Free - Fast & Secure",
		description: "Convert Base64 strings to images (PNG, JPG, WebP) instantly. Our privacy-first tool processes data locally in your browser, ensuring your images stay secure. Fr",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/base64-to-image-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<Base64ToImageTool />
		</ToolLayout>
	);
}
