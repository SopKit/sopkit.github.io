import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JobMessageGenerator from "@/components/tools/impl/JobMessageGenerator";

export default function ToolPage() {
	const tool = getToolByRoute("/cover-letter-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<JobMessageGenerator defaultTab="cover-letter" />
		</ToolLayout>
	);
}
