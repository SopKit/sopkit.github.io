import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free YAML to JSON Converter Online | SopKit",
	description: "Convert YAML configuration data to clean JSON structures instantly. Safe, secure, and executed fully client-side in your browser. No signup required.",
	alternates: {
		canonical: "https://sopkit.github.io/yaml-to-json-converter/",
	},
	openGraph: {
		title: "Free YAML to JSON Converter Online | SopKit",
		description: "Convert YAML configuration data to clean JSON structures instantly. Safe, secure, and executed fully client-side in your browser. No signup required.",
		url: "https://sopkit.github.io/yaml-to-json-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-images/developer-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YAML to JSON Converter Online | SopKit",
		description: "Convert YAML configuration data to clean JSON structures instantly. Safe, secure, and executed fully client-side in your browser. No signup required.",
		images: ["/og-images/developer-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/yaml-to-json-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
