import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import KeywordTool from "@/components/tools/seo/KeywordTool";

export const metadata = {
	title: "Keywords Suggestion Tool Online Free - No Signup | SopKit",
	description: "Free keywords suggestion tool tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/keywords-suggestion-tool",
	},
	openGraph: {
		title: "Keywords Suggestion Tool Online Free - No Signup",
		description: "Free keywords suggestion tool tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-bas",
		url: "https://sopkit.github.io/keywords-suggestion-tool",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Keywords Suggestion Tool Online Free - Fast & Secure",
		description: "Free keywords suggestion tool tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-bas",
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
