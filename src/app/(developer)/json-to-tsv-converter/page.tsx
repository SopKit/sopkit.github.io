import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";

export const metadata = {
	title: "JSON to TSV Converter Online Free - Developer Tools | SopKit",
	description: "Convert JSON data to Tab-Separated Values (TSV) format instantly. Our free online converter helps you prepare data for Excel and other spreadsheet applications. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-tsv-converter/",
	},
	openGraph: {
		title: "JSON to TSV Converter Online Free - No Signup",
		description: "Convert JSON data to Tab-Separated Values (TSV) format instantly. Our free online converter helps you prepare data for Excel and other spreadsheet applications.",
		url: "https://sopkit.github.io/json-to-tsv-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON to TSV Converter Online Free - Fast & Secure",
		description: "Convert JSON data to Tab-Separated Values (TSV) format instantly. Our free online converter helps you prepare data for Excel and other spreadsheet applications.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-to-tsv-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSerialization toolId="json-to-tsv-converter" />
		</ToolLayout>
	);
}
