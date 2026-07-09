import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Add Watermark to Image Online Free - Photo Protect | SopKit",
	description: "Add text or image logos as watermarks to your pictures securely. Adjust opacity, scale, positioning, rotation, and tile configurations. 100% private.",
	alternates: {
		canonical: "https://sopkit.github.io/image-watermark/",
	},
	openGraph: {
		title: "Add Watermark to Image Online Free - Photo Protect | SopKit",
		description: "Add text or image logos as watermarks to your pictures securely. Adjust opacity, scale, positioning, rotation, and tile configurations. 100% private.",
		url: "https://sopkit.github.io/image-watermark/",
		siteName: "SopKit",
		images: [{ url: "/og-images/image-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Add Watermark to Image Online Free - Photo Protect | SopKit",
		description: "Add text or image logos as watermarks to your pictures securely. Adjust opacity, scale, positioning, rotation, and tile configurations. 100% private.",
		images: ["/og-images/image-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/image-watermark");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
