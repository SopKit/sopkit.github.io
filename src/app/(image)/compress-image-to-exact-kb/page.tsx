import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageCompressorTool from "@/components/tools/image/ImageCompressorTool";


export const metadata = {
	title: "Free Compress Image to Exact KB Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Compress Image to Exact KB online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
	keywords: "compress image to exact kb, free online tool, no signup, compress image to exact kb online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/compress-image-to-exact-kb",
	},
	openGraph: {
		title: "Free Compress Image to Exact KB Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Compress Image to Exact KB online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
		url: "https://sopkit.github.io/compress-image-to-exact-kb",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Compress Image to Exact KB Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Compress Image to Exact KB online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/compress-image-to-exact-kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageCompressorTool />
		</ToolLayout>
	);
}
