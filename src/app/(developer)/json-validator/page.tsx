import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JsonFormatterTool from "@/components/tools/code/JsonFormatterTool";

export const metadata = {
	title: "JSON Validator Online Free - Developer Tools | SopKit",
	description: "Validate your JSON data for syntax errors and structural integrity instantly. Our free online tool helps you catch bugs and ensure your JSON is RFC-compliant. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-validator",
	},
	openGraph: {
		title: "JSON Validator Online Free - No Signup",
		description: "Validate your JSON data for syntax errors and structural integrity instantly. Our free online tool helps you catch bugs and ensure your JSON is RFC-compliant. N",
		url: "https://sopkit.github.io/json-validator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON Validator Online Free - Fast & Secure",
		description: "Validate your JSON data for syntax errors and structural integrity instantly. Our free online tool helps you catch bugs and ensure your JSON is RFC-compliant. N",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-validator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<JsonFormatterTool />
		</ToolLayout>
	);
}
