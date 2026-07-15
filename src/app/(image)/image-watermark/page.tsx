import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free Image Watermark Adder Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Image Watermark Adder online. Crop, resize, and optimize photos in your browser with no signup. Free & secure.",
	keywords: "image watermark adder, free online tool, no signup, image watermark adder online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/image-watermark",
	},
	openGraph: {
		title: "Free Image Watermark Adder Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Watermark Adder online. Crop, resize, and optimize photos in your browser with no signup. Free & secure.",
		url: "https://sopkit.github.io/image-watermark",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Image Watermark Adder Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Image Watermark Adder online. Crop, resize, and optimize photos in your browser with no signup. Free & secure.",
		images: ["/og-image.jpg"],
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
