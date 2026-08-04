import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Cookie Consent Generator",
	description: "Generate GDPR-compliant cookie consent banners and privacy notices for your website. Customize styles and export code.",
	route: "/cookie-consent-generator",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/cookie-consent-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="cookie-consent-generator" />
		</ToolLayout>
	);
}
