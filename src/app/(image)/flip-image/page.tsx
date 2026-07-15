import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageResizerTool from "@/components/tools/image/ImageResizerTool";

export const metadata = {
	title: "Free Flip Image Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Flip Image online. Crop, resize, and optimize photos in your browser with no signup. 100% free and easy to use.",
	keywords: "flip image, free online tool, no signup, flip image online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/flip-image",
	},
	openGraph: {
		title: "Free Flip Image Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Flip Image online. Crop, resize, and optimize photos in your browser with no signup. 100% free and easy to use.",
		url: "https://sopkit.github.io/flip-image",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Flip Image Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Flip Image online. Crop, resize, and optimize photos in your browser with no signup. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/flip-image");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageResizerTool />
		</ToolLayout>
	);
}
