import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import LoveCalculator from "@/components/tools/calculators/LoveCalculator";

export const metadata = generateToolMetadata({
	name: "Love Calculator",
	description: "Privacy-friendly, 100% client-side love calculation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/love-calculator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/love-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LoveCalculator />
		</ToolLayout>
	);
}
