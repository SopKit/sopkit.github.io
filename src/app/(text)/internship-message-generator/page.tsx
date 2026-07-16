import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JobMessageGenerator from "@/components/tools/impl/JobMessageGenerator";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Internship Application Message Generator",
	description: "Private Internship Application Message: privately generate text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/internship-message-generator",
	category: "text",
});

export default function ToolPage() {
	const tool = getToolByRoute("/internship-message-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JobMessageGenerator defaultTab="internship-message" />
		</ToolLayout>
	);
}
