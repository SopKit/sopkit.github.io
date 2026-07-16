import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LegalTemplateGenerator from "@/components/tools/built-ins/LegalTemplateGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Disclaimer Generator",
	description: "Private Disclaimer: privately generate web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/disclaimer-generator",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/disclaimer-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LegalTemplateGenerator />
		</ToolLayout>
	);
}
