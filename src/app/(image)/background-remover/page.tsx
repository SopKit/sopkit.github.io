import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BackgroundRemoverTool from "@/components/tools/image/BackgroundRemoverTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Background Remover",
	description: "Private Background Remover: privately process images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/background-remover",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/background-remover");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BackgroundRemoverTool />
		</ToolLayout>
	);
}
