import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Privacy Policy Auditor",
	description: "Audit your privacy policy for GDPR, CCPA, and other regulation compliance. Get a checklist and improvement suggestions.",
	route: "/privacy-policy-auditor",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/privacy-policy-auditor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="privacy-policy-auditor" />
		</ToolLayout>
	);
}
