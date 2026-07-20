import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "JavaScript Notebook",
	description: "Private JavaScript Notebook: interactively write, run, and debug JavaScript code entirely in your browser. A Jupyter-style environment with multi-cell support, console output, async/await, and export/import. 100% client-side sandbox — no server uploads, no AI training, no data collection.",
	route: "/javascript-notebook",
	category: "developer",
});

export default function ToolPage() {
	const tool = getToolByRoute("/javascript-notebook");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
