import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DomainToIPTool from "@/components/tools/built-ins/DomainToIPTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Domain to IP Converter",
	description: "Private Domain to IP Converter: privately convert web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/domain-to-ip-converter",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/domain-to-ip-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DomainToIPTool />
		</ToolLayout>
	);
}
