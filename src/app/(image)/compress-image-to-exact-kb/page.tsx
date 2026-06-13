import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageCompressorTool from "@/components/tools/image/ImageCompressorTool";


export const metadata = {
	title: "Compress Image to Exact KB Online Free | SopKit",
	description: "Compress JPG, PNG, or WebP images to exact KB sizes like 10KB, 20KB, 50KB, 100KB, and 200KB online for free. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/compress-image-to-exact-kb",
	},
	openGraph: {
		title: "Compress Image to Exact KB Online Free - No Signup | SopKit",
		description: "Compress JPG, PNG, or WebP images to exact KB sizes like 10KB, 20KB, 50KB, 100KB, and 200KB online for free. No signup, no uploads, 100% private browser-based t",
		url: "https://sopkit.github.io/compress-image-to-exact-kb",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Compress Image to Exact KB Online Free - Fast & Secure",
		description: "Compress JPG, PNG, or WebP images to exact KB sizes like 10KB, 20KB, 50KB, 100KB, and 200KB online for free. No signup, no uploads, 100% private browser-based t",
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
