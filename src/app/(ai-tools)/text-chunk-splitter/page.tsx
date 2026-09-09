import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TextChunkSplitter from "@/components/tools/ai/TextChunkSplitter";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Text Chunk Splitter for RAG",
	description:
		"Split long documents into overlapping chunks by tokens, words, or characters for RAG pipelines and embedding APIs. Paragraph-aware splitting with instant export.",
	route: "/text-chunk-splitter",
	category: "ai-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/text-chunk-splitter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextChunkSplitter />
		</ToolLayout>
	);
}
