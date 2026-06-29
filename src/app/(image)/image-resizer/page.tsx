import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageResizerTool from "@/components/tools/image/ImageResizerTool";

export const metadata = {
	title: "Image Resizer Online Free - Compress & Convert Images | SopKit",
	description: "Resize images with custom dimensions and aspect ratios No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/image-resizer/",
	},
	openGraph: {
		title: "Image Resizer Online Free - No Signup",
		description: "Resize images with custom dimensions and aspect ratios No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/image-resizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Image Resizer Online Free - Fast & Secure",
		description: "Resize images with custom dimensions and aspect ratios No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/image-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageResizerTool />
		</ToolLayout>
	);
}
