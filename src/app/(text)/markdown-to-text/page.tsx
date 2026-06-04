import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import MarkdownToText from "@/components/tools/text/MarkdownToText";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Markdown to Text Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Markdown to Text online. Fast and private browser utility with no signup. Try it free now.",
	keywords: "markdown to text, free online tool, no signup, markdown-to-text, free markdown-to-text, Markdown To Text online, text tool, text editor online, content formatter, writing utility, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/markdown-to-text",
	},
	openGraph: {
		title: "Free Markdown to Text Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Markdown to Text online. Fast and private browser utility with no signup. Try it free now.",
		url: "https://sopkit.github.io/markdown-to-text",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Markdown to Text Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Markdown to Text online. Fast and private browser utility with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/markdown-to-text");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<MarkdownToText />
		</ToolLayout>
	);
}
