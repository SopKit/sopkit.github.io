import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";

export const metadata = {
	title: "JSON to XML Converter Online Free - Developer Tools | SopKit",
	description: "Convert JSON data to XML format instantly. Our free online tool handles nesting and attributes to ensure a clean transformation for legacy system compatibility. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-xml-converter",
	},
	openGraph: {
		title: "JSON to XML Converter Online Free - No Signup",
		description: "Convert JSON data to XML format instantly. Our free online tool handles nesting and attributes to ensure a clean transformation for legacy system compatibility.",
		url: "https://sopkit.github.io/json-to-xml-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON to XML Converter Online Free - Fast & Secure",
		description: "Convert JSON data to XML format instantly. Our free online tool handles nesting and attributes to ensure a clean transformation for legacy system compatibility.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-to-xml-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BuiltInSerialization toolId="json-to-xml-converter" />
		</ToolLayout>
	);
}
