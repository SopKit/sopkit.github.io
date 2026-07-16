import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64Tool from "@/components/tools/developer/Base64Tool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Base64 Encode",
	description: "Private Base64 Encode: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/base64-encode",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/base64-encode");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<Base64Tool />
		</ToolLayout>
	);
}
