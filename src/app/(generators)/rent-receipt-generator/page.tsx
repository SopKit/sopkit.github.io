import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RentReceiptGenerator from "@/components/tools/generators/RentReceiptGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Rent Receipt Generator",
	description: "Private Rent Receipt: privately generate content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/rent-receipt-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/rent-receipt-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RentReceiptGenerator />
		</ToolLayout>
	);
}
