import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "HEX to Binary Converter",
	description: "Private HEX to Binary Converter: privately convert code and data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/hex-to-binary-converter",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/hex-to-binary-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="hex-to-binary" />
		</ToolLayout>
	);
}
