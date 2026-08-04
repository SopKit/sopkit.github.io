import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Breach Notification Generator",
	description: "Generate data breach notification templates for customers, regulators, and internal teams. Compliant with GDPR and state laws.",
	route: "/breach-notification-generator",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/breach-notification-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="breach-notification-generator" />
		</ToolLayout>
	);
}
