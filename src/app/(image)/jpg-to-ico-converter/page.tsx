import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "JPG to ICO Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert JPG images to ICO favicon files for your website. Our free tool creates high-quality icons in multiple sizes for perfect browser compatibility. No signup required. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/jpg-to-ico-converter",
	},
	openGraph: {
		title: "JPG to ICO Converter Online Free - No Signup",
		description: "Convert JPG images to ICO favicon files for your website. Our free tool creates high-quality icons in multiple sizes for perfect browser compatibility. No signu",
		url: "https://sopkit.github.io/jpg-to-ico-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JPG to ICO Converter Online Free - Fast & Secure",
		description: "Convert JPG images to ICO favicon files for your website. Our free tool creates high-quality icons in multiple sizes for perfect browser compatibility. No signu",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/jpg-to-ico-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<ImageConverterTool defaultOutputFormat="jpeg" />
		</ToolLayout>
	);
}
