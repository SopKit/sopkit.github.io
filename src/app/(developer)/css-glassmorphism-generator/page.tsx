import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CssGlassmorphismGenerator from "@/components/tools/developer/CssGlassmorphismGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "CSS Glassmorphism Generator",
	description: "Create modern frosted glass UI elements with real-time blur, opacity, saturation, and border controls. Copy instant CSS and Tailwind CSS classes with zero server processing.",
	route: "/css-glassmorphism-generator",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/css-glassmorphism-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CssGlassmorphismGenerator />
		</ToolLayout>
	);
}
