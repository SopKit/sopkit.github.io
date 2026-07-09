import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Image to Base64 Converter Online Free | SopKit",
	description: "Convert PNG, JPG, SVG, WebP, and GIF images to Base64 data URI string instantly. Generate raw code, HTML image tags, or CSS snippets. 100% private.",
	alternates: {
		canonical: "https://sopkit.github.io/image-to-base64/",
	},
	openGraph: {
		title: "Image to Base64 Converter Online Free | SopKit",
		description: "Convert PNG, JPG, SVG, WebP, and GIF images to Base64 data URI string instantly. Generate raw code, HTML image tags, or CSS snippets. 100% private.",
		url: "https://sopkit.github.io/image-to-base64/",
		siteName: "SopKit",
		images: [{ url: "/og-images/image-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Image to Base64 Converter Online Free | SopKit",
		description: "Convert PNG, JPG, SVG, WebP, and GIF images to Base64 data URI string instantly. Generate raw code, HTML image tags, or CSS snippets. 100% private.",
		images: ["/og-images/image-tools.png"],
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
