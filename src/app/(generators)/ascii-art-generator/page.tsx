import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import AsciiArtGeneratorTool from "@/components/tools/generators/AsciiArtGeneratorTool";

export const metadata = generateToolMetadata({
	name: "Ascii Art Generator",
	description: "Privacy-friendly, 100% client-side ascii art generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/ascii-art-generator",
	category: "ascii-art-generator",
});


export default async function ToolPage() {
	const tool = getToolByRoute("/ascii-art-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AsciiArtGeneratorTool />
		</ToolLayout>
	);
}
