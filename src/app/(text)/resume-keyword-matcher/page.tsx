import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResumeATSChecker from "@/components/tools/impl/ResumeATSChecker";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Resume Keyword Matcher",
	description: "Private Resume Keyword Matcher: privately process text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/resume-keyword-matcher",
	category: "text",
});

export default function ToolPage() {
	const tool = getToolByRoute("/resume-keyword-matcher");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ResumeATSChecker />
		</ToolLayout>
	);
}
