import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import KeywordTool from "@/components/tools/seo/KeywordTool";

export const metadata = {
	title: "Keywords Suggestion Tool - Free Keyword Ideas Generator | SopKit",
	description: "Generate hundreds of long-tail keyword suggestions for SEO and content in seconds. Free keyword research tool that runs in your browser — no signup, no login, 100% private.",
	keywords: "keyword suggestion tool, keyword research, long-tail keywords, seo keywords, free keyword generator, keyword ideas",
	alternates: {
		canonical: "https://sopkit.github.io/keywords-suggestion-tool/",
	},
	openGraph: {
		title: "Keywords Suggestion Tool - Free Keyword Ideas Generator",
		description: "Generate hundreds of long-tail keyword suggestions for SEO and content in seconds. Free, browser-based, and private — no signup required.",
		url: "https://sopkit.github.io/keywords-suggestion-tool/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Keywords Suggestion Tool - Free Keyword Ideas Generator",
		description: "Generate hundreds of long-tail keyword suggestions for SEO and content in seconds. Free, browser-based, and private — no signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/keywords-suggestion-tool");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<KeywordTool />
		</ToolLayout>
	);
}
