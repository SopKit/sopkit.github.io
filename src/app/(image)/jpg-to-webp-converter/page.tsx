import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "JPG to WebP Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert JPG to WebP for superior web performance. Reduce file sizes significantly without losing quality. Our free online converter helps you speed up your website instantly. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/jpg-to-webp-converter/",
	},
	openGraph: {
		title: "JPG to WebP Converter Online Free - No Signup",
		description: "Convert JPG to WebP for superior web performance. Reduce file sizes significantly without losing quality. Our free online converter helps you speed up your webs",
		url: "https://sopkit.github.io/jpg-to-webp-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JPG to WebP Converter Online Free - Fast & Secure",
		description: "Convert JPG to WebP for superior web performance. Reduce file sizes significantly without losing quality. Our free online converter helps you speed up your webs",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/jpg-to-webp-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="jpeg" />
		</ToolLayout>
	);
}
