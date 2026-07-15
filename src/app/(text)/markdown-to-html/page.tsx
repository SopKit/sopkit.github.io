import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Markdown to HTML Converter Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Markdown to HTML Converter online. Fast and private browser utility with no signup.",
	keywords: "markdown to html converter, free online tool, no signup, markdown to html converter online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/markdown-to-html",
	},
	openGraph: {
		title: "Free Markdown to HTML Converter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Markdown to HTML Converter online. Fast and private browser utility with no signup.",
		url: "https://sopkit.github.io/markdown-to-html",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Markdown to HTML Converter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Markdown to HTML Converter online. Fast and private browser utility with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/markdown-to-html");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
