import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "WebP to PNG Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert WebP to PNG to restore transparency and compatibility with all image editors. High-quality, free, and privacy-focused online conversion tool. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/webp-to-png-converter/",
	},
	openGraph: {
		title: "WebP to PNG Converter Online Free - No Signup",
		description: "Convert WebP to PNG to restore transparency and compatibility with all image editors. High-quality, free, and privacy-focused online conversion tool. No signup,",
		url: "https://sopkit.github.io/webp-to-png-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "WebP to PNG Converter Online Free - Fast & Secure",
		description: "Convert WebP to PNG to restore transparency and compatibility with all image editors. High-quality, free, and privacy-focused online conversion tool. No signup,",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/webp-to-png-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="png" />
		</ToolLayout>
	);
}
