import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free Image to Base64 Converter Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Image to Base64 Converter online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
	keywords: "image to base64 converter, free online tool, no signup, image to base64 converter online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/image-to-base64",
	},
	openGraph: {
		title: "Free Image to Base64 Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image to Base64 Converter online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
		url: "https://sopkit.github.io/image-to-base64",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Image to Base64 Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image to Base64 Converter online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/image-to-base64");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
