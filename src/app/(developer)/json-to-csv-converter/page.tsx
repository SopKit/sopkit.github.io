import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";

export const metadata = {
	title: "Free JSON to CSV Converter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JSON to CSV Converter online. Secure, local developer utility with no registration. 100% free.",
	keywords: "json to csv converter, free online tool, no signup, json to csv converter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-csv-converter",
	},
	openGraph: {
		title: "Free JSON to CSV Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON to CSV Converter online. Secure, local developer utility with no registration. 100% free.",
		url: "https://sopkit.github.io/json-to-csv-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JSON to CSV Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON to CSV Converter online. Secure, local developer utility with no registration. 100% free.",
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
