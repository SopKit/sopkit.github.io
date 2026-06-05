import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export default function ToolPage() {
	const tool = getToolByRoute("/remove-duplicate-lines");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
