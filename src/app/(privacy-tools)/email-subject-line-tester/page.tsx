import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Email Subject Line Tester",
	description: "Score email subject lines for open rate potential, spam risk, length, and clarity.",
	route: "/email-subject-line-tester",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/email-subject-line-tester");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="email-subject-line-tester" />
		</ToolLayout>
	);
}
