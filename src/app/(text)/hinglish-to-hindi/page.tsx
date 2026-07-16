import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import KrutiDevConverter from "@/components/tools/text/KrutiDevConverter";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Hinglish to Hindi Converter",
	description: "Private Hinglish to Hindi Converter: privately convert text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/hinglish-to-hindi",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/hinglish-to-hindi");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<KrutiDevConverter defaultMode="hinglish-to-hindi" />
		</ToolLayout>
	);
}
