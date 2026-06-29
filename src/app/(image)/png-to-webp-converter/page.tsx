import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "PNG to WebP Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert PNG to WebP to optimize your website speed. Significantly reduce file sizes while maintaining image transparency and quality. Free, fast, and secure online tool. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/png-to-webp-converter/",
	},
	openGraph: {
		title: "PNG to WebP Converter Online Free - No Signup",
		description: "Convert PNG to WebP to optimize your website speed. Significantly reduce file sizes while maintaining image transparency and quality. Free, fast, and secure onl",
		url: "https://sopkit.github.io/png-to-webp-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PNG to WebP Converter Online Free - Fast & Secure",
		description: "Convert PNG to WebP to optimize your website speed. Significantly reduce file sizes while maintaining image transparency and quality. Free, fast, and secure onl",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/png-to-webp-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="png" />
		</ToolLayout>
	);
}
