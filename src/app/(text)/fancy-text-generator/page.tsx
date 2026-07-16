import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import FancyTextGenerator from "@/components/tools/text/FancyTextGenerator";

export const metadata = generateToolMetadata({
	name: "Fancy Text Generator",
	description: "Privacy-friendly, 100% client-side fancy text generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/fancy-text-generator",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/fancy-text-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FancyTextGenerator />
		</ToolLayout>
	);
}
