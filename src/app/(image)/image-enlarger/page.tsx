import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageResizerTool from "@/components/tools/image/ImageResizerTool";

export const metadata = {
	title: "Free Image Enlarger Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Image Enlarger online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
	keywords: "image enlarger, free online tool, no signup, image enlarger online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/image-enlarger",
	},
	openGraph: {
		title: "Free Image Enlarger Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Enlarger online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
		url: "https://sopkit.github.io/image-enlarger",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Image Enlarger Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Enlarger online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/image-enlarger");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageResizerTool />
		</ToolLayout>
	);
}
