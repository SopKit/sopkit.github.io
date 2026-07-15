import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64ToImageTool from "@/components/tools/image/Base64ToImageTool";

export const metadata = {
	title: "Free Base64 to Image Converter Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Base64 to Image Converter online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
	keywords: "base64 to image converter, free online tool, no signup, base64 to image converter online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/base64-to-image-converter",
	},
	openGraph: {
		title: "Free Base64 to Image Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Base64 to Image Converter online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
		url: "https://sopkit.github.io/base64-to-image-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Base64 to Image Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Base64 to Image Converter online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
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
