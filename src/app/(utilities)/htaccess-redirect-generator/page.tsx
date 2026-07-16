import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import HtaccessGenerator from "@/components/tools/built-ins/HtaccessGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Htaccess Redirect Generator",
	description: "Private Htaccess Redirect: privately generate web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/htaccess-redirect-generator",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/htaccess-redirect-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<HtaccessGenerator />
		</ToolLayout>
	);
}
