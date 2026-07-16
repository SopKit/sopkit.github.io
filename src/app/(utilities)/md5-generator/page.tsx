import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import HashGeneratorTool from "@/components/tools/security/HashGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "MD5 Generator",
	description: "Private MD5: privately generate web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/md5-generator",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/md5-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<HashGeneratorTool />
		</ToolLayout>
	);
}
