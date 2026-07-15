import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free PNG to JPG Converter Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free PNG to JPG Converter online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
	keywords: "png to jpg converter, free online tool, no signup, png to jpg converter online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/png-to-jpg",
	},
	openGraph: {
		title: "Free PNG to JPG Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free PNG to JPG Converter online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
		url: "https://sopkit.github.io/png-to-jpg",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PNG to JPG Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free PNG to JPG Converter online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/png-to-jpg");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
