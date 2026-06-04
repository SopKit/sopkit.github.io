import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import KeywordTool from "@/components/tools/seo/KeywordTool";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Keywords Suggestion Tool Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Keywords Suggestion Tool online. Optimize search presence with no signup. 100% free.",
	keywords: "keywords suggestion tool, free online tool, no signup, keywords-suggestion-tool, free keywords-suggestion-tool, Keywords Suggestion Tool online, SEO tool, search optimizer, website analyzer, free SEO utility, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/keywords-suggestion-tool",
	},
	openGraph: {
		title: "Free Keywords Suggestion Tool Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Keywords Suggestion Tool online. Optimize search presence with no signup. 100% free.",
		url: "https://sopkit.github.io/keywords-suggestion-tool",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Keywords Suggestion Tool Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Keywords Suggestion Tool online. Optimize search presence with no signup. 100% free.",
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
		<ToolLayout tool={tool}>
			<KeywordTool />
		</ToolLayout>
	);
}
