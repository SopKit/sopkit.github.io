import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResignationLetterGenerator from "@/components/tools/generators/ResignationLetterGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Resignation Letter Generator",
	description: "Private Resignation Letter: privately generate content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/resignation-letter-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/resignation-letter-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ResignationLetterGenerator />
		</ToolLayout>
	);
}
