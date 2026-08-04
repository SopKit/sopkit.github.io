import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Domain Reputation Checker",
	description: "Check domain reputation, age, and safety status. Analyze if a website is trustworthy, blacklisted, or suspicious.",
	route: "/domain-reputation-checker",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/domain-reputation-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="domain-reputation-checker" />
		</ToolLayout>
	);
}
