import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import NumberGeneratorTool from "@/components/tools/generators/NumberGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Number Generator",
	description: "Privacy-friendly, 100% client-side number generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/number-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/number-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<NumberGeneratorTool />
		</ToolLayout>
	);
}
