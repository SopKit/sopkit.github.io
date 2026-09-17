import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Data Breach Checker",
	description: "Check if your email or credentials have been compromised in known security data breaches. 100% private, anonymous hashing.",
	route: "/data-breach-checker",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/data-breach-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="data-breach-checker" />
		</ToolLayout>
	);
}
