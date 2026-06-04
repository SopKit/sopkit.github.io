import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JSONToSchemaTool from "@/components/tools/developer/JSONToSchemaTool";

export const metadata = {
	title: "JSON to JSON Schema Online Free - Developer Tools | SopKit",
	description: "Generate a JSON Schema from your JSON data automatically. Our free online tool helps you define validation rules and document your JSON structure for APIs. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-json-schema",
	},
	openGraph: {
		title: "JSON to JSON Schema Online Free - No Signup",
		description: "Generate a JSON Schema from your JSON data automatically. Our free online tool helps you define validation rules and document your JSON structure for APIs. No s",
		url: "https://sopkit.github.io/json-to-json-schema",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON to JSON Schema Online Free - Fast & Secure",
		description: "Generate a JSON Schema from your JSON data automatically. Our free online tool helps you define validation rules and document your JSON structure for APIs. No s",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-to-json-schema");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<JSONToSchemaTool />
		</ToolLayout>
	);
}
