import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Text to ASCII Converter Online Free - Developer Tools | SopKit",
	description: "Convert plain text into ASCII character codes instantly. Our free online tool provides decimal ASCII values for every character in your input string. Fast and secure. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-ascii-converter/",
	},
	openGraph: {
		title: "Text to ASCII Converter Online Free - No Signup",
		description: "Convert plain text into ASCII character codes instantly. Our free online tool provides decimal ASCII values for every character in your input string. Fast and s",
		url: "https://sopkit.github.io/text-to-ascii-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Text to ASCII Converter Online Free - Fast & Secure",
		description: "Convert plain text into ASCII character codes instantly. Our free online tool provides decimal ASCII values for every character in your input string. Fast and s",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/text-to-ascii-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="text-to-ascii" />
		</ToolLayout>
	);
}
