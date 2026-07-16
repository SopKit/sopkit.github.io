import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FaqSchemaGenerator from "@/components/tools/built-ins/FaqSchemaGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "FAQ Schema Generator",
	description: "Private FAQ Schema: privately generate web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/faq-schema-generator",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/faq-schema-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FaqSchemaGenerator />
		</ToolLayout>
	);
}
