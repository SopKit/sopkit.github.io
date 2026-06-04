import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageResizerTool from "@/components/tools/image/ImageResizerTool";

export const metadata = {
	title: "Image Editor Online Free - Compress & Convert Images | SopKit",
	description: "Edit, crop, and enhance your photos online with our free image editing tools. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/image-editor",
	},
	openGraph: {
		title: "Image Editor Online Free - No Signup",
		description: "Edit, crop, and enhance your photos online with our free image editing tools. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/image-editor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Image Editor Online Free - Fast & Secure",
		description: "Edit, crop, and enhance your photos online with our free image editing tools. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/image-editor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<ImageResizerTool />
		</ToolLayout>
	);
}
