import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageCompressorTool from "@/components/tools/image/ImageCompressorTool";

export const metadata = {
	title: "Image Compressor Online Free - Compress & Convert Images | SopKit",
	description: "Compress images online for free without losing quality. Reduce file size of JPG, PNG, and WebP images instantly. Secure, browser-based processing. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/image-compressor",
	},
	openGraph: {
		title: "Image Compressor Online Free - No Signup",
		description: "Compress images online for free without losing quality. Reduce file size of JPG, PNG, and WebP images instantly. Secure, browser-based processing. No signup, no",
		url: "https://sopkit.github.io/image-compressor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Image Compressor Online Free - Fast & Secure",
		description: "Compress images online for free without losing quality. Reduce file size of JPG, PNG, and WebP images instantly. Secure, browser-based processing. No signup, no",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/image-compressor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageCompressorTool />
		</ToolLayout>
	);
}
