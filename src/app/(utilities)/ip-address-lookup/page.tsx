import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IPLocationFinderTool from "@/components/tools/utilities/IPLocationFinderTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "IP Address Lookup",
	description: "Private IP Address Lookup: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/ip-address-lookup",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ip-address-lookup");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IPLocationFinderTool />
		</ToolLayout>
	);
}
