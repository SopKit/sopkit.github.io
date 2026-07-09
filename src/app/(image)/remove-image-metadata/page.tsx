import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Image Metadata (EXIF) Remover Online Free | SopKit",
	description: "Remove sensitive GPS, camera, and author metadata from your images before sharing online. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/remove-image-metadata/",
	},
	openGraph: {
		title: "Image Metadata (EXIF) Remover Online Free - No Signup | SopKit",
		description: "Remove sensitive GPS, camera, and author metadata from your images before sharing online. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/remove-image-metadata/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Image Metadata (EXIF) Remover Online Free - Fast & Secure",
		description: "Remove sensitive GPS, camera, and author metadata from your images before sharing online. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/remove-image-metadata");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
