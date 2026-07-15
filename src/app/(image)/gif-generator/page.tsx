import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free GIF Generator Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free GIF Generator online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
	keywords: "gif generator, free online tool, no signup, gif generator online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/gif-generator",
	},
	openGraph: {
		title: "Free GIF Generator Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free GIF Generator online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
		url: "https://sopkit.github.io/gif-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free GIF Generator Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free GIF Generator online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
		images: ["/og-image.jpg"],
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
