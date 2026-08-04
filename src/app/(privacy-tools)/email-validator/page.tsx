import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Email Validator",
	description: "Validate email addresses for format, domain, and deliverability. Check if an email is valid, disposable, or from a free provider.",
	route: "/email-validator",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/email-validator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="email-validator" />
		</ToolLayout>
	);
}
