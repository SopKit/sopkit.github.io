import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import PrivacyToolWrapper from "@/components/tools/privacy/PrivacyToolWrapper";

export const metadata = generateToolMetadata({
	name: "Email Preview Generator",
	description: "Generate email previews across desktop, mobile, and dark mode. Test how your email looks in different clients before sending.",
	route: "/email-preview-generator",
	category: "privacy-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/email-preview-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PrivacyToolWrapper toolId="email-preview-generator" />
		</ToolLayout>
	);
}
