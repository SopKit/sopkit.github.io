import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UTMBuilderTool from "@/components/tools/utilities/UTMBuilderTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "UTM Builder",
	description: "Private UTM Builder: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/utm-builder",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/utm-builder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UTMBuilderTool />
		</ToolLayout>
	);
}
