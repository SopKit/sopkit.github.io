import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";

export const metadata = {
	title: "JSON to Text Converter Online Free - Developer Tools | SopKit",
	description: "Convert JSON data into readable plain text instantly. Our free online tool is perfect for extracting values and creating human-readable documentation from raw data. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-text-converter/",
	},
	openGraph: {
		title: "JSON to Text Converter Online Free - No Signup",
		description: "Convert JSON data into readable plain text instantly. Our free online tool is perfect for extracting values and creating human-readable documentation from raw d",
		url: "https://sopkit.github.io/json-to-text-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON to Text Converter Online Free - Fast & Secure",
		description: "Convert JSON data into readable plain text instantly. Our free online tool is perfect for extracting values and creating human-readable documentation from raw d",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-to-text-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSerialization toolId="json-to-text-converter" />
		</ToolLayout>
	);
}
