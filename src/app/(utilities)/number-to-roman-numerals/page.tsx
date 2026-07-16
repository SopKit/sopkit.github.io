import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RomanNumeralTool from "@/components/tools/built-ins/RomanNumeralTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Number to Roman Numerals",
	description: "Private Number to Roman Numerals: privately process web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/number-to-roman-numerals",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/number-to-roman-numerals");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RomanNumeralTool />
		</ToolLayout>
	);
}
