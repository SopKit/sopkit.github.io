import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import QrGeneratorPremium from "@/components/tools/utilities/QrGeneratorPremium";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "QR Code Generator",
	description: "Private QR Code: privately generate web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/qr-code-generator",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/qr-code-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<QrGeneratorPremium />
		</ToolLayout>
	);
}
