import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "CSV to JSON Converter",
	description: "Private CSV to JSON Converter: privately convert code and data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/csv-to-json-converter",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/csv-to-json-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSerialization toolId="csv-to-json-converter" />
		</ToolLayout>
	);
}
