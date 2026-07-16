import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LogoGeneratorTool from "@/components/tools/image/LogoGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Logo Generator",
	description: "Private Logo: privately generate images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/logo-generator",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/logo-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LogoGeneratorTool />
		</ToolLayout>
	);
}
