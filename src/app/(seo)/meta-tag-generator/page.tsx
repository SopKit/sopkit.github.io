import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import MetaTagGenerator from "@/components/tools/built-ins/MetaTagGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Meta Tag Generator",
	description: "Private Meta Tag: privately generate website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/meta-tag-generator",
	category: "seo",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/meta-tag-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<MetaTagGenerator />
		</ToolLayout>
	);
}
