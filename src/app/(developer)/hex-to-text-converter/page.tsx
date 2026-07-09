import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "HEX to Text Converter Online Free - Developer Tools | SopKit",
	description: "Convert hexadecimal strings back to readable text instantly. Our free online HEX to Text tool is perfect for decoding data, debugging, and discovering hidden text streams. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/hex-to-text-converter/",
	},
	openGraph: {
		title: "HEX to Text Converter Online Free - No Signup",
		description: "Convert hexadecimal strings back to readable text instantly. Our free online HEX to Text tool is perfect for decoding data, debugging, and discovering hidden te",
		url: "https://sopkit.github.io/hex-to-text-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "HEX to Text Converter Online Free - Fast & Secure",
		description: "Convert hexadecimal strings back to readable text instantly. Our free online HEX to Text tool is perfect for decoding data, debugging, and discovering hidden te",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/hex-to-text-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="hex-to-text" />
		</ToolLayout>
	);
}
