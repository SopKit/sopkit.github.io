import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Data Anonymization Report Generator",
	description: "Generate data anonymization reports for GDPR Article 25 compliance. Document anonymization techniques and risk assessments.",
	route: "/data-anonymization-report-generator",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/data-anonymization-report-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="data-anonymization-report-generator" />
		</ToolLayout>
	);
}
