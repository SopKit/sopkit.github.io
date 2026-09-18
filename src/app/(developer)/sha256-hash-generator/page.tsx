import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import HashGeneratorTool from "@/components/tools/security/HashGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "SHA256 Hash Generator",
	description: "Generate SHA-256 cryptographic digests and HMACs online. Fast, browser-based, zero uploads.",
	route: "/sha256-hash-generator",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/sha256-hash-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<HashGeneratorTool />
		</ToolLayout>
	);
}
