import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free JSON to YAML Converter Online | SopKit",
	description: "Convert JSON data strings to clean YAML configurations instantly. Safe, secure, and executed fully client-side in your browser. No signup required.",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-yaml-converter/",
	},
	openGraph: {
		title: "Free JSON to YAML Converter Online | SopKit",
		description: "Convert JSON data strings to clean YAML configurations instantly. Safe, secure, and executed fully client-side in your browser. No signup required.",
		url: "https://sopkit.github.io/json-to-yaml-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-images/developer-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JSON to YAML Converter Online | SopKit",
		description: "Convert JSON data strings to clean YAML configurations instantly. Safe, secure, and executed fully client-side in your browser. No signup required.",
		images: ["/og-images/developer-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/json-to-yaml-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
