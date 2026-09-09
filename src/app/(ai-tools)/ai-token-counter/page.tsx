import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import AiTokenCounter from "@/components/tools/ai/AiTokenCounter";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "AI Token Counter & Cost Calculator",
	description: "Estimate tokens and API costs for GPT-5, Claude, Gemini, and Llama before you hit send. Live estimates, model price table, and batch paste support that runs fully in your browser.",
	route: "/ai-token-counter",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-token-counter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AiTokenCounter />
		</ToolLayout>
	);
}
