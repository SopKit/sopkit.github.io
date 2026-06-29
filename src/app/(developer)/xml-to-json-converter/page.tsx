import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";

export const metadata = {
	title: "XML to JSON Converter Online Free - Developer Tools | SopKit",
	description: "Convert XML documents to JSON format instantly. Our free online converter handles complex XML hierarchies to provide clean, developer-friendly JSON output for web apps. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/xml-to-json-converter/",
	},
	openGraph: {
		title: "XML to JSON Converter Online Free - No Signup",
		description: "Convert XML documents to JSON format instantly. Our free online converter handles complex XML hierarchies to provide clean, developer-friendly JSON output for w",
		url: "https://sopkit.github.io/xml-to-json-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "XML to JSON Converter Online Free - Fast & Secure",
		description: "Convert XML documents to JSON format instantly. Our free online converter handles complex XML hierarchies to provide clean, developer-friendly JSON output for w",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/xml-to-json-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSerialization toolId="xml-to-json-converter" />
		</ToolLayout>
	);
}
