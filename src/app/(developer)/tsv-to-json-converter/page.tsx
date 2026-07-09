import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";

export const metadata = {
	title: "TSV to JSON Converter Online Free - Developer Tools | SopKit",
	description: "Convert Tab-Separated Values (TSV) into JSON format instantly. Our free online tool makes it easy to transform structured data for web applications and API development. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/tsv-to-json-converter/",
	},
	openGraph: {
		title: "TSV to JSON Converter Online Free - No Signup",
		description: "Convert Tab-Separated Values (TSV) into JSON format instantly. Our free online tool makes it easy to transform structured data for web applications and API deve",
		url: "https://sopkit.github.io/tsv-to-json-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "TSV to JSON Converter Online Free - Fast & Secure",
		description: "Convert Tab-Separated Values (TSV) into JSON format instantly. Our free online tool makes it easy to transform structured data for web applications and API deve",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/tsv-to-json-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSerialization toolId="tsv-to-json-converter" />
		</ToolLayout>
	);
}
