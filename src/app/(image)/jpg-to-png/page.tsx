import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free JPG to PNG Converter Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free JPG to PNG Converter online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
	keywords: "jpg to png converter, free online tool, no signup, jpg to png converter online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/jpg-to-png",
	},
	openGraph: {
		title: "Free JPG to PNG Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free JPG to PNG Converter online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
		url: "https://sopkit.github.io/jpg-to-png",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JPG to PNG Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free JPG to PNG Converter online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/jpg-to-png");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
