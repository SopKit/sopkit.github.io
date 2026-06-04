import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WordCounterTool from "@/components/tools/text/WordCounterTool";

export const metadata = {
	title: "Number to Word Converter Online Free - No Signup | SopKit",
	description: "Convert numbers to words instantly with our free online converter. Perfect for writing checks, legal documents, or educational purposes. Supports multiple formats and large numbers. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/number-to-word-converter",
	},
	openGraph: {
		title: "Number to Word Converter Online Free - No Signup",
		description: "Convert numbers to words instantly with our free online converter. Perfect for writing checks, legal documents, or educational purposes. Supports multiple forma",
		url: "https://sopkit.github.io/number-to-word-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Number to Word Converter Online Free - Fast & Secure",
		description: "Convert numbers to words instantly with our free online converter. Perfect for writing checks, legal documents, or educational purposes. Supports multiple forma",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/number-to-word-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<WordCounterTool />
		</ToolLayout>
	);
}
