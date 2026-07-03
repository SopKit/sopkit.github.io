import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import MarkdownToText from "@/components/tools/text/MarkdownToText";

export const metadata = {
	title: "Markdown to Text Online Free - No Signup | SopKit",
	description: "Convert Markdown formatted text to clean plain text instantly. Perfect for cleaning up content from ChatGPT, Claude, and GitHub. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/markdown-to-text/",
	},
	openGraph: {
		title: "Markdown to Text Online Free - No Signup",
		description: "Convert Markdown formatted text to clean plain text instantly. Perfect for cleaning up content from ChatGPT, Claude, and GitHub. No signup, no uploads, 100% pri",
		url: "https://sopkit.github.io/markdown-to-text",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Markdown to Text Online Free - Fast & Secure",
		description: "Convert Markdown formatted text to clean plain text instantly. Perfect for cleaning up content from ChatGPT, Claude, and GitHub. No signup, no uploads, 100% pri",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<MarkdownToText />
		</ToolLayout>
	);
}
