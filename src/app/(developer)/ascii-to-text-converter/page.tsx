import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "ASCII to Text Converter Online Free - Developer Tools | SopKit",
	description: "Convert ASCII character codes back to readable text instantly. Our free online tool makes it easy to decode ASCII sequences for development and debugging tasks. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/ascii-to-text-converter",
	},
	openGraph: {
		title: "ASCII to Text Converter Online Free - No Signup",
		description: "Convert ASCII character codes back to readable text instantly. Our free online tool makes it easy to decode ASCII sequences for development and debugging tasks.",
		url: "https://sopkit.github.io/ascii-to-text-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "ASCII to Text Converter Online Free - Fast & Secure",
		description: "Convert ASCII character codes back to readable text instantly. Our free online tool makes it easy to decode ASCII sequences for development and debugging tasks.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ascii-to-text-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BaseConverter converterKind="ascii-to-text" />
		</ToolLayout>
	);
}
