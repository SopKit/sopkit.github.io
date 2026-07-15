import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "Free Image Converter Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Image Converter online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
	keywords: "image converter, free online tool, no signup, image converter online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/image-converter",
	},
	openGraph: {
		title: "Free Image Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Converter online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
		url: "https://sopkit.github.io/image-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Image Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Converter online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool />
		</ToolLayout>
	);
}
