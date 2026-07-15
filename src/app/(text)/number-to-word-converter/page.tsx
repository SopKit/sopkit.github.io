import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WordCounterTool from "@/components/tools/text/WordCounterTool";

export const metadata = {
	title: "Free Number to Word Converter Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Number to Word Converter online. Fast and private browser utility with no signup. 100% free.",
	keywords: "number to word converter, free online tool, no signup, number to word converter online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/number-to-word-converter",
	},
	openGraph: {
		title: "Free Number to Word Converter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Number to Word Converter online. Fast and private browser utility with no signup. 100% free.",
		url: "https://sopkit.github.io/number-to-word-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Number to Word Converter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Number to Word Converter online. Fast and private browser utility with no signup. 100% free.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<WordCounterTool />
		</ToolLayout>
	);
}
