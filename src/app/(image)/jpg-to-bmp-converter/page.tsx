import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "JPG to BMP Converter Online Free - Compress & Convert Images | SopKit",
	description: "Convert JPG images to BMP (Bitmap) format for legacy system compatibility. Fast, free, and secure online converter that works in your browser without uploading files to any server. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/jpg-to-bmp-converter",
	},
	openGraph: {
		title: "JPG to BMP Converter Online Free - No Signup",
		description: "Convert JPG images to BMP (Bitmap) format for legacy system compatibility. Fast, free, and secure online converter that works in your browser without uploading ",
		url: "https://sopkit.github.io/jpg-to-bmp-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JPG to BMP Converter Online Free - Fast & Secure",
		description: "Convert JPG images to BMP (Bitmap) format for legacy system compatibility. Fast, free, and secure online converter that works in your browser without uploading ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/jpg-to-bmp-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<ImageConverterTool defaultOutputFormat="jpeg" />
		</ToolLayout>
	);
}
