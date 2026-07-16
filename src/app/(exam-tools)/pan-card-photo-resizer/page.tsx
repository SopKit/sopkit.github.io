import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PanCardResizer from "@/components/tools/exam/PanCardResizer";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "PAN Card Photo Resizer",
	description: "Private PAN Card Photo Resizer: privately process exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/pan-card-photo-resizer",
	category: "exam-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/pan-card-photo-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PanCardResizer />
		</ToolLayout>
	);
}
