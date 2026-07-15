import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free Circular Image Crop Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Circular Image Crop online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
	keywords: "circular image crop, free online tool, no signup, circular image crop online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/circular-image-crop",
	},
	openGraph: {
		title: "Free Circular Image Crop Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Circular Image Crop online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
		url: "https://sopkit.github.io/circular-image-crop",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Circular Image Crop Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Circular Image Crop online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/circular-image-crop");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
