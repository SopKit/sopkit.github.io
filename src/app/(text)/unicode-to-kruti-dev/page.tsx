import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import KrutiDevConverter from "@/components/tools/text/KrutiDevConverter";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Unicode to Kruti Dev Converter",
	description: "Private Unicode to Kruti Dev Converter: privately convert text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/unicode-to-kruti-dev",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/unicode-to-kruti-dev");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<KrutiDevConverter defaultMode="uni-to-kruti" />
		</ToolLayout>
	);
}
