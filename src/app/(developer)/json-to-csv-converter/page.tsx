import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";

export const metadata = {
	title: "JSON to CSV Converter Online Free - Developer Tools | SopKit",
	description: "Convert JSON data to CSV format instantly. Our free online converter makes it easy to transform complex JSON structures into simple spreadsheet-ready tables. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-csv-converter/",
	},
	openGraph: {
		title: "JSON to CSV Converter Online Free - No Signup",
		description: "Convert JSON data to CSV format instantly. Our free online converter makes it easy to transform complex JSON structures into simple spreadsheet-ready tables. No",
		url: "https://sopkit.github.io/json-to-csv-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON to CSV Converter Online Free - Fast & Secure",
		description: "Convert JSON data to CSV format instantly. Our free online converter makes it easy to transform complex JSON structures into simple spreadsheet-ready tables. No",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-to-csv-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSerialization toolId="json-to-csv-converter" />
		</ToolLayout>
	);
}
