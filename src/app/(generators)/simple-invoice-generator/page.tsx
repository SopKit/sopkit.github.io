import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import InvoiceGenerator from "@/components/tools/generators/InvoiceGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Simple Invoice Generator",
	description: "Private Simple Invoice: privately generate content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/simple-invoice-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/simple-invoice-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InvoiceGenerator />
		</ToolLayout>
	);
}
