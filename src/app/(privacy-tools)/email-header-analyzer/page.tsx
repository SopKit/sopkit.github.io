import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Email Header Analyzer",
	description: "Analyze email headers for deliverability issues, spoofing, and routing problems. Inspect SPF, DKIM, DMARC, and IP paths.",
	route: "/email-header-analyzer",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/email-header-analyzer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="email-header-analyzer" />
		</ToolLayout>
	);
}
