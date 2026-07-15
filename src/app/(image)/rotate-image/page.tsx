import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageResizerTool from "@/components/tools/image/ImageResizerTool";

export const metadata = {
	title: "Free Rotate Image Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Rotate Image online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
	keywords: "rotate image, free online tool, no signup, rotate image online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/rotate-image",
	},
	openGraph: {
		title: "Free Rotate Image Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Rotate Image online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
		url: "https://sopkit.github.io/rotate-image",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Rotate Image Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Rotate Image online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/rotate-image");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageResizerTool />
		</ToolLayout>
	);
}
