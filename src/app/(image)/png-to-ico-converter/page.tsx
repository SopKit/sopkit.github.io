import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "PNG to ICO Converter Online Free - Compress & Convert Images | SopKit",
	description: "Generate high-quality ICO favicon files from PNG images. Our free tool supports multiple sizes for perfect website icon compatibility. Privacy-first browser-based conversion. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/png-to-ico-converter/",
	},
	openGraph: {
		title: "PNG to ICO Converter Online Free - No Signup",
		description: "Generate high-quality ICO favicon files from PNG images. Our free tool supports multiple sizes for perfect website icon compatibility. Privacy-first browser-bas",
		url: "https://sopkit.github.io/png-to-ico-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PNG to ICO Converter Online Free - Fast & Secure",
		description: "Generate high-quality ICO favicon files from PNG images. Our free tool supports multiple sizes for perfect website icon compatibility. Privacy-first browser-bas",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/png-to-ico-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="png" />
		</ToolLayout>
	);
}
