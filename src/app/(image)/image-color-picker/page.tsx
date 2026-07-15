import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Pro Image Color Picker Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Pro Image Color Picker online. Crop, resize, and optimize photos in your browser with no signup. Free & secure.",
	keywords: "pro image color picker, free online tool, no signup, pro image color picker online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/image-color-picker",
	},
	openGraph: {
		title: "Free Pro Image Color Picker Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Pro Image Color Picker online. Crop, resize, and optimize photos in your browser with no signup. Free & secure.",
		url: "https://sopkit.github.io/image-color-picker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Pro Image Color Picker Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Pro Image Color Picker online. Crop, resize, and optimize photos in your browser with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/image-color-picker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
