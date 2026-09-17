import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PixelArtMaker from "@/components/tools/generators/PixelArtMaker";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Pixel Art Maker",
	description: "Design retro 8-bit and 16-bit pixel art graphics in your browser with interactive grid controls, customizable palettes, and PNG export.",
	route: "/pixel-art-maker",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/pixel-art-maker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PixelArtMaker />
		</ToolLayout>
	);
}
