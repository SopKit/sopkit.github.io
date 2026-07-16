import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import TextToHandwriting from "@/components/tools/text/TextToHandwriting";

export const metadata = generateToolMetadata({
	name: "Text to Handwriting",
	description: "Privacy-friendly, 100% client-side text to handwriting conversion. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/text-to-handwriting",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/text-to-handwriting");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextToHandwriting />
		</ToolLayout>
	);
}
