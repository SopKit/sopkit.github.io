import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JSONFormatterTool from "@/components/tools/developer/JSONFormatterTool";

export const metadata = {
	title: "JSON Formatter Online Free - Developer Tools | SopKit",
	description: "Format and beautify your JSON data instantly for better readability. Our free online tool validates your JSON structure and provides a clean, indented view of your code. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-formatter/",
	},
	openGraph: {
		title: "JSON Formatter Online Free - No Signup",
		description: "Format and beautify your JSON data instantly for better readability. Our free online tool validates your JSON structure and provides a clean, indented view of y",
		url: "https://sopkit.github.io/json-formatter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON Formatter Online Free - Fast & Secure",
		description: "Format and beautify your JSON data instantly for better readability. Our free online tool validates your JSON structure and provides a clean, indented view of y",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-formatter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JSONFormatterTool />
		</ToolLayout>
	);
}
