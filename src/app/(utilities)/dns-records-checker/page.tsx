import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DnsLookupTool from "@/components/tools/built-ins/DnsLookupTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "DNS Records Checker",
	description: "Private DNS Records Checker: privately validate web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/dns-records-checker",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/dns-records-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DnsLookupTool />
		</ToolLayout>
	);
}
