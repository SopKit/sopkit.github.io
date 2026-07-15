import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageResizerTool from "@/components/tools/image/ImageResizerTool";

export const metadata = {
	title: "Free Image Cropper Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Image Cropper online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
	keywords: "image cropper, free online tool, no signup, image cropper online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/image-cropper",
	},
	openGraph: {
		title: "Free Image Cropper Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Cropper online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
		url: "https://sopkit.github.io/image-cropper",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Image Cropper Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Cropper online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/image-cropper");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageResizerTool />
		</ToolLayout>
	);
}
