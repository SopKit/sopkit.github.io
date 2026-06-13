import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "JPG to PNG Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert JPG to PNG with transparency support. Maintain high image quality and convert formats instantly in your browser. Free, secure, and privacy-focused online tool. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/jpg-to-png-converter",
	},
	openGraph: {
		title: "JPG to PNG Converter Online Free - No Signup",
		description: "Convert JPG to PNG with transparency support. Maintain high image quality and convert formats instantly in your browser. Free, secure, and privacy-focused onlin",
		url: "https://sopkit.github.io/jpg-to-png-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JPG to PNG Converter Online Free - Fast & Secure",
		description: "Convert JPG to PNG with transparency support. Maintain high image quality and convert formats instantly in your browser. Free, secure, and privacy-focused onlin",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/jpg-to-png-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="png" />
		</ToolLayout>
	);
}
