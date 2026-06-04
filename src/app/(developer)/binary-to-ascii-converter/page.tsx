import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Binary to ASCII Converter Online Free - Developer Tools | SopKit",
	description: "Transform binary code (0s and 1s) into readable ASCII text instantly. Our free online converter is fast, accurate, and works entirely in your browser. No signup required. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/binary-to-ascii-converter",
	},
	openGraph: {
		title: "Binary to ASCII Converter Online Free - No Signup",
		description: "Transform binary code (0s and 1s) into readable ASCII text instantly. Our free online converter is fast, accurate, and works entirely in your browser. No signup",
		url: "https://sopkit.github.io/binary-to-ascii-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Binary to ASCII Converter Online Free - Fast & Secure",
		description: "Transform binary code (0s and 1s) into readable ASCII text instantly. Our free online converter is fast, accurate, and works entirely in your browser. No signup",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/binary-to-ascii-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BaseConverter converterKind="binary-to-ascii" />
		</ToolLayout>
	);
}
