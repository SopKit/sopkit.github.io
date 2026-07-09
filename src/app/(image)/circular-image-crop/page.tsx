import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Circular Image Crop Online Free - Avatar & Profile Cropper | SopKit",
	description: "Crop images into perfect circular shapes online. Ideal for Twitter, LinkedIn, Discord, and Instagram profile pictures. Completely private & local processing.",
	alternates: {
		canonical: "https://sopkit.github.io/circular-image-crop/",
	},
	openGraph: {
		title: "Circular Image Crop Online Free - Avatar & Profile Cropper | SopKit",
		description: "Crop images into perfect circular shapes online. Ideal for Twitter, LinkedIn, Discord, and Instagram profile pictures. Completely private & local processing.",
		url: "https://sopkit.github.io/circular-image-crop/",
		siteName: "SopKit",
		images: [{ url: "/og-images/image-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Circular Image Crop Online Free - Avatar & Profile Cropper | SopKit",
		description: "Crop images into perfect circular shapes online. Ideal for Twitter, LinkedIn, Discord, and Instagram profile pictures. Completely private & local processing.",
		images: ["/og-images/image-tools.png"],
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
