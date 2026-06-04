import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import KeywordTool from "@/components/tools/seo/KeywordTool";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Advanced Keyword Research Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Advanced Keyword Research online. Optimize search presence with no signup.",
	keywords: "keyword research tool, seo keyword finder, search keywords, keyword analysis, free seo tool, SopKit, keyword-research-tool, free keyword-research-tool, keyword research tool online, seo tool, website analyzer, online seo checker",
	alternates: {
		canonical: "https://sopkit.github.io/keyword-research-tool",
	},
	openGraph: {
		title: "Free Advanced Keyword Research Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Advanced Keyword Research online. Optimize search presence with no signup.",
		url: "https://sopkit.github.io/keyword-research-tool",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Advanced Keyword Research Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Advanced Keyword Research online. Optimize search presence with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/keyword-research-tool");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<KeywordTool />
		</ToolLayout>
	);
}
