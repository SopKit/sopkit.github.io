import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import InvoiceGenerator from "@/components/tools/generators/InvoiceGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Simple Invoice Generator",
	description: "Privacy-friendly, 100% client-side simple invoice generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
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
