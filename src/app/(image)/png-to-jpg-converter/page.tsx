import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "PNG to JPG Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert PNG images to JPG format for smaller file sizes and better web compatibility. Our free online tool maintains high quality and works instantly in your browser. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/png-to-jpg-converter/",
	},
	openGraph: {
		title: "PNG to JPG Converter Online Free - No Signup",
		description: "Convert PNG images to JPG format for smaller file sizes and better web compatibility. Our free online tool maintains high quality and works instantly in your br",
		url: "https://sopkit.github.io/png-to-jpg-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PNG to JPG Converter Online Free - Fast & Secure",
		description: "Convert PNG images to JPG format for smaller file sizes and better web compatibility. Our free online tool maintains high quality and works instantly in your br",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/png-to-jpg-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="png" />
		</ToolLayout>
	);
}
