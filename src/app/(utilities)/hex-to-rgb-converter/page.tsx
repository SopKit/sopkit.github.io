import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RgbHexConverter from "@/components/tools/built-ins/RgbHexConverter";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "HEX to RGB Converter",
	description: "Private HEX to RGB Converter: privately convert web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/hex-to-rgb-converter",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/hex-to-rgb-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RgbHexConverter mode="hex-rgb" />
		</ToolLayout>
	);
}
