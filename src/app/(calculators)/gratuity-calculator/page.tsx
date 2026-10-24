import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Gratuity Calculator (India)",
	description: "Enter your last drawn salary and years of service to estimate gratuity under the Payment of Gratuity Act, using the 15/26 formula, with the tax-exempt amount shown.",
	route: "/gratuity-calculator",
	category: "calculators",
});

export default function ToolPage() {
	const tool = getToolByRoute("/gratuity-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
