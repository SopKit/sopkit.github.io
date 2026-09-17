import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import MemeGenerator from "@/components/tools/generators/MemeGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Meme Generator",
	description: "Create viral memes online with popular templates or custom image uploads. Add top and bottom text with custom fonts and colors. 100% free and private.",
	route: "/meme-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/meme-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<MemeGenerator />
		</ToolLayout>
	);
}
