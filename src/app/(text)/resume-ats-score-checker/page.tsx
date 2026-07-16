import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResumeATSChecker from "@/components/tools/impl/ResumeATSChecker";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Resume ATS Score Checker",
	description: "Private Resume ATS Score Checker: privately validate text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/resume-ats-score-checker",
	category: "text",
});

export default function ToolPage() {
	const tool = getToolByRoute("/resume-ats-score-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ResumeATSChecker />
		</ToolLayout>
	);
}
