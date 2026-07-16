import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PublicIpTool from "@/components/tools/built-ins/PublicIpTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "What Is My IP Address",
	description: "Private What Is My IP Address: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/what-is-my-ip-address",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/what-is-my-ip-address");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PublicIpTool />
		</ToolLayout>
	);
}
