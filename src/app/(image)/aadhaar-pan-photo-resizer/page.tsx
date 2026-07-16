import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PanCardResizer from "@/components/tools/exam/PanCardResizer";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Aadhaar and PAN Card Photo Resizer",
	description: "Private Aadhaar and PAN Card Photo Resizer: privately compress images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/aadhaar-pan-photo-resizer",
	category: "image",
});

export default function ToolPage() {
	const tool = getToolByRoute("/aadhaar-pan-photo-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PanCardResizer />
		</ToolLayout>
	);
}
