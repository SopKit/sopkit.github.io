import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "ASCII to Binary Converter Online Free - Developer Tools | SopKit",
	description: "Convert ASCII text to binary code instantly. Our free online converter is perfect for computer science students, developers, and hobbyists. Fast, secure, and browser-based. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/ascii-to-binary-converter",
	},
	openGraph: {
		title: "ASCII to Binary Converter Online Free - No Signup",
		description: "Convert ASCII text to binary code instantly. Our free online converter is perfect for computer science students, developers, and hobbyists. Fast, secure, and br",
		url: "https://sopkit.github.io/ascii-to-binary-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "ASCII to Binary Converter Online Free - Fast & Secure",
		description: "Convert ASCII text to binary code instantly. Our free online converter is perfect for computer science students, developers, and hobbyists. Fast, secure, and br",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ascii-to-binary-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BaseConverter converterKind="ascii-to-binary" />
		</ToolLayout>
	);
}
