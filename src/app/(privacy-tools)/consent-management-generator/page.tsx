import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Consent Management Generator",
	description: "Generate consent management banners and preference centers for GDPR and CCPA compliance. Export customizable code.",
	route: "/consent-management-generator",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/consent-management-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="consent-management-generator" />
		</ToolLayout>
	);
}
