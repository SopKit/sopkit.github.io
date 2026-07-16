import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RentReceiptGenerator from "@/components/tools/generators/RentReceiptGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Rent Receipt Generator",
	description: "Privacy-friendly, 100% client-side rent receipt generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
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
