import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Spam Word Checker",
	description: "Scan email copy for spam trigger words. Get a spam score and suggestions to improve deliverability before sending.",
	route: "/spam-word-checker",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/spam-word-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="spam-word-checker" />
		</ToolLayout>
	);
}
