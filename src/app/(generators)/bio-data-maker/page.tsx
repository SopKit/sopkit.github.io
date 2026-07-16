import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BioDataMaker from "@/components/tools/generators/BioDataMaker";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Bio Data Maker",
	description: "Privacy-friendly, 100% client-side bio data creation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/bio-data-maker",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/bio-data-maker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BioDataMaker />
		</ToolLayout>
	);
}
