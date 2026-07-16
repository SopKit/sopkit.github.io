import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SeoToolkit from "@/components/tools/seo/SeoToolkit";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "SEO Toolkit",
	description: "Private SEO Toolkit: privately validate website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/seotoolkit",
	category: "seo",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/seotoolkit");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SeoToolkit />
		</ToolLayout>
	);
}
