import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free WEBP to PNG Converter Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free WEBP to PNG Converter online. Crop, resize, and optimize photos in your browser with no signup. Free & secure.",
	keywords: "webp to png converter, free online tool, no signup, webp to png converter online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/webp-to-png",
	},
	openGraph: {
		title: "Free WEBP to PNG Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free WEBP to PNG Converter online. Crop, resize, and optimize photos in your browser with no signup. Free & secure.",
		url: "https://sopkit.github.io/webp-to-png",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free WEBP to PNG Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free WEBP to PNG Converter online. Crop, resize, and optimize photos in your browser with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/webp-to-png");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
