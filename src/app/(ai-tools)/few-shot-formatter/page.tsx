import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FewShotFormatter from "@/components/tools/ai/FewShotFormatter";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Few-Shot Prompt Formatter",
	description:
		"Convert example input/output pairs into clean few-shot prompt blocks with numbered turns, XML tags, or markdown separators for better model performance.",
	route: "/few-shot-formatter",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/few-shot-formatter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FewShotFormatter />
		</ToolLayout>
	);
}
