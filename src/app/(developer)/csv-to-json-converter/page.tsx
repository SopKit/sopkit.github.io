import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";

export const metadata = {
	title: "CSV to JSON Converter Online Free - Developer Tools | SopKit",
	description: "Convert CSV files to JSON format instantly. Our free online converter makes it easy to transform spreadsheet data into developer-friendly JSON code for web applications and APIs. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/csv-to-json-converter/",
	},
	openGraph: {
		title: "CSV to JSON Converter Online Free - No Signup",
		description: "Convert CSV files to JSON format instantly. Our free online converter makes it easy to transform spreadsheet data into developer-friendly JSON code for web appl",
		url: "https://sopkit.github.io/csv-to-json-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "CSV to JSON Converter Online Free - Fast & Secure",
		description: "Convert CSV files to JSON format instantly. Our free online converter makes it easy to transform spreadsheet data into developer-friendly JSON code for web appl",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/csv-to-json-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSerialization toolId="csv-to-json-converter" />
		</ToolLayout>
	);
}
