import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "PII Scrubber",
	description: "Remove personal information from text before sending to AI. Scrub emails, phone numbers, SSNs, credit cards, and API keys locally.",
	route: "/pii-scrubber",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/pii-scrubber");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="pii-scrubber" />
		</ToolLayout>
	);
}
