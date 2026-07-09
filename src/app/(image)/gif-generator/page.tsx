import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free Animated GIF Generator Online - Convert Images to GIF | SopKit",
	description: "Convert multiple PNG, JPG, or WebP images into an animated GIF. Adjust delay speed, dimensions, and loops client-side. No registration required.",
	alternates: {
		canonical: "https://sopkit.github.io/gif-generator/",
	},
	openGraph: {
		title: "Free Animated GIF Generator Online - Convert Images to GIF | SopKit",
		description: "Convert multiple PNG, JPG, or WebP images into an animated GIF. Adjust delay speed, dimensions, and loops client-side. No registration required.",
		url: "https://sopkit.github.io/gif-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-images/image-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Animated GIF Generator Online - Convert Images to GIF | SopKit",
		description: "Convert multiple PNG, JPG, or WebP images into an animated GIF. Adjust delay speed, dimensions, and loops client-side. No registration required.",
		images: ["/og-images/image-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/gif-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
