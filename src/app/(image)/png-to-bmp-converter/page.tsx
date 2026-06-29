import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "PNG to BMP Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert PNG images to BMP format instantly. Our free online converter preserves original quality while ensuring compatibility with legacy software. Fast, secure, and privacy-focused. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/png-to-bmp-converter/",
	},
	openGraph: {
		title: "PNG to BMP Converter Online Free - No Signup",
		description: "Convert PNG images to BMP format instantly. Our free online converter preserves original quality while ensuring compatibility with legacy software. Fast, secure",
		url: "https://sopkit.github.io/png-to-bmp-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PNG to BMP Converter Online Free - Fast & Secure",
		description: "Convert PNG images to BMP format instantly. Our free online converter preserves original quality while ensuring compatibility with legacy software. Fast, secure",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/png-to-bmp-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="png" />
		</ToolLayout>
	);
}
