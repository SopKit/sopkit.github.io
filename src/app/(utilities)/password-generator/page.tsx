import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PasswordGeneratorTool from "@/components/tools/utilities/PasswordGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Password Generator",
	description: "Private Password: privately generate web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/password-generator",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/password-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PasswordGeneratorTool />
		</ToolLayout>
	);
}
