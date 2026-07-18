import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Gemini Watermark Remover",
	description: "Remove the Google Gemini AI logo and watermarks from your images online. Process 100% client-side inside your browser for complete privacy — no uploads, no data selling, no AI training.",
	route: "/gemini-watermark-remover",
	category: "image",
});

export default function ToolPage() {
	const tool = getToolByRoute("/gemini-watermark-remover");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
