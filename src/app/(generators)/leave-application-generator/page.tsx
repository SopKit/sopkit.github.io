import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LeaveLetterGenerator from "@/components/tools/generators/LeaveLetterGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Leave Application Generator",
	description: "Privacy-friendly, 100% client-side leave application generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/leave-application-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/leave-application-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LeaveLetterGenerator />
		</ToolLayout>
	);
}
