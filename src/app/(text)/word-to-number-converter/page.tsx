import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WordCounterTool from "@/components/tools/text/WordCounterTool";

export const metadata = {
	title: "Word to Number Converter Online Free - No Signup | SopKit",
	description: "Convert words into digits instantly with our free online Word to Number converter. Perfect for data entry, educational exercises, and technical documentation cleanup. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/word-to-number-converter/",
	},
	openGraph: {
		title: "Word to Number Converter Online Free - No Signup",
		description: "Convert words into digits instantly with our free online Word to Number converter. Perfect for data entry, educational exercises, and technical documentation cl",
		url: "https://sopkit.github.io/word-to-number-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Word to Number Converter Online Free - Fast & Secure",
		description: "Convert words into digits instantly with our free online Word to Number converter. Perfect for data entry, educational exercises, and technical documentation cl",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/word-to-number-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<WordCounterTool />
		</ToolLayout>
	);
}
