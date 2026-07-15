import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";

export const metadata = {
	title: "Free JSON to TSV Converter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JSON to TSV Converter online. Secure, local developer utility with no registration. 100% free.",
	keywords: "json to tsv converter, free online tool, no signup, json to tsv converter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-tsv-converter",
	},
	openGraph: {
		title: "Free JSON to TSV Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON to TSV Converter online. Secure, local developer utility with no registration. 100% free.",
		url: "https://sopkit.github.io/json-to-tsv-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JSON to TSV Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON to TSV Converter online. Secure, local developer utility with no registration. 100% free.",
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
