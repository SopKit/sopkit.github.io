import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Phishing URL Checker",
	description: "Check if a URL is safe or a phishing site. Analyze links for suspicious patterns, domain age, and known threats.",
	route: "/phishing-url-checker",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/phishing-url-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="phishing-url-checker" />
		</ToolLayout>
	);
}
