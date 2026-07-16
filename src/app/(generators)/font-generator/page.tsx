import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FontGeneratorTool from "@/components/tools/generators/FontGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Font Generator",
	description: "Privacy-friendly, 100% client-side font generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/font-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/font-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FontGeneratorTool />
		</ToolLayout>
	);
}
