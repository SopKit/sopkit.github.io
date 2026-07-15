import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageCompressorTool from "@/components/tools/image/ImageCompressorTool";

export const metadata = {
	title: "Free Image Compressor Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Image Compressor online. Crop, resize, and optimize photos in your browser with no signup. No signup required.",
	keywords: "image compressor, free online tool, no signup, image compressor online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/image-compressor",
	},
	openGraph: {
		title: "Free Image Compressor Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Compressor online. Crop, resize, and optimize photos in your browser with no signup. No signup required.",
		url: "https://sopkit.github.io/image-compressor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Image Compressor Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Compressor online. Crop, resize, and optimize photos in your browser with no signup. No signup required.",
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
