import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PhotoNameDateEditor from "@/components/tools/exam/PhotoNameDateEditor";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Photo Name Date Editor",
	description: "Private Photo Name Date Editor: privately process exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/photo-name-date-editor",
	category: "exam-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/photo-name-date-editor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PhotoNameDateEditor />
		</ToolLayout>
	);
}
