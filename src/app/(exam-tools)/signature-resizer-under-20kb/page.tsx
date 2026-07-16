import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SignatureResizer from "@/components/tools/exam/SignatureResizer";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Signature Resizer Under 20KB",
	description: "Private Signature Resizer Under 20KB: privately compress exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/signature-resizer-under-20kb",
	category: "exam-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/signature-resizer-under-20kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SignatureResizer />
		</ToolLayout>
	);
}
