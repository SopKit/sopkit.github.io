import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CreditCardGeneratorTool from "@/components/tools/security/CreditCardGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Credit Card Generator",
	description: "Private Credit Card: privately generate web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/credit-card-generator",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/credit-card-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CreditCardGeneratorTool />
		</ToolLayout>
	);
}
