import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResumeATSChecker from "@/components/tools/impl/ResumeATSChecker";

export default function ToolPage() {
	const tool = getToolByRoute("/resume-keyword-matcher");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<ResumeATSChecker />
		</ToolLayout>
	);
}
