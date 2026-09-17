import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ColorPaletteGenerator from "@/components/tools/generators/ColorPaletteGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Color Palette Generator",
	description: "Generate beautiful, harmonious color palettes for web design, digital art, and branding. Export hex codes, RGB, and CSS variables instantly in your browser.",
	route: "/color-palette-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/color-palette-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ColorPaletteGenerator />
		</ToolLayout>
	);
}
