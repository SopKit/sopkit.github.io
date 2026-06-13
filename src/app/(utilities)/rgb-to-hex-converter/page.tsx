import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RgbHexConverter from "@/components/tools/built-ins/RgbHexConverter";

export const metadata = {
	title: "RGB to HEX Converter Online Free - No Signup | SopKit",
	description: "Free rgb to hex converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/rgb-to-hex-converter",
	},
	openGraph: {
		title: "RGB to HEX Converter Online Free - No Signup",
		description: "Free rgb to hex converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		url: "https://sopkit.github.io/rgb-to-hex-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "RGB to HEX Converter Online Free - Fast & Secure",
		description: "Free rgb to hex converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/rgb-to-hex-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RgbHexConverter mode="rgb-hex" />
		</ToolLayout>
	);
}
