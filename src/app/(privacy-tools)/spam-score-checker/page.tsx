import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Spam Score Checker",
	description: "Check the spam score of your email or message. Analyze content, links, and formatting for deliverability issues.",
	route: "/spam-score-checker",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/spam-score-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="spam-score-checker" />
		</ToolLayout>
	);
}
