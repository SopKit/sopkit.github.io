import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Image Metadata (EXIF) Remover Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Image Metadata (EXIF) Remover online. Crop, resize, and optimize photos in your browser with no signup.",
	keywords: "image metadata (exif) remover, free online tool, no signup, image metadata (exif) remover online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/remove-image-metadata",
	},
	openGraph: {
		title: "Free Image Metadata (EXIF) Remover Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Metadata (EXIF) Remover online. Crop, resize, and optimize photos in your browser with no signup.",
		url: "https://sopkit.github.io/remove-image-metadata",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Image Metadata (EXIF) Remover Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Metadata (EXIF) Remover online. Crop, resize, and optimize photos in your browser with no signup.",
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
