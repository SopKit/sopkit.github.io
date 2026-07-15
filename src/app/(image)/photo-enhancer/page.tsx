import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PhotoEnhancerTool from "@/components/tools/image/PhotoEnhancerTool";

export const metadata = {
	title: "Free Photo Enhancer Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Photo Enhancer online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
	keywords: "photo enhancer, free online tool, no signup, photo enhancer online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/photo-enhancer",
	},
	openGraph: {
		title: "Free Photo Enhancer Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Photo Enhancer online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
		url: "https://sopkit.github.io/photo-enhancer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Photo Enhancer Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Photo Enhancer online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/photo-enhancer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PhotoEnhancerTool />
		</ToolLayout>
	);
}
