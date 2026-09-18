import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64Tool from "@/components/tools/developer/Base64Tool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Base64 Encoder & Decoder",
	description: "Free online Base64 encoder and decoder tool. Convert text, images, and binary data into URL-safe Base64 strings directly in your browser with complete privacy.",
	route: "/base64-tool",
	category: "developer",
});

export default function ToolPage() {
	const tool = getToolByRoute("/base64-tool") || {
		id: "base64-tool",
		name: "Base64 Encoder & Decoder",
		route: "/base64-tool",
		category: "developer",
		description: "Convert text and files into Base64 format locally in your browser.",
	};

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<Base64Tool />
		</ToolLayout>
	);
}
