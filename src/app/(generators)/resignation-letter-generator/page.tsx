import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResignationLetterGenerator from "@/components/tools/generators/ResignationLetterGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Resignation Letter Generator",
	description: "Privacy-friendly, 100% client-side resignation letter generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
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
