import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageToBase64Tool from "@/components/tools/image/ImageToBase64Tool";

export const metadata = {
	title: "Image to Base64 Converter Online Free - Compress & Convert Images | SopKit",
	description: "Free image to base64 converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/image-to-base64-converter",
	},
	openGraph: {
		title: "Image to Base64 Converter Online Free - No Signup",
		description: "Free image to base64 converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-ba",
		url: "https://sopkit.github.io/image-to-base64-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Image to Base64 Converter Online Free - Fast & Secure",
		description: "Free image to base64 converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-ba",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/image-to-base64-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<ImageToBase64Tool />
		</ToolLayout>
	);
}
