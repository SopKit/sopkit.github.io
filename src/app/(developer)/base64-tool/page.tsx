import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64Tool from "@/components/tools/developer/Base64Tool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Base64 Tool",
	description: "Private Base64: privately process code and data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/base64-tool",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/base64-tool");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<Base64Tool />
		</ToolLayout>
	);
}
