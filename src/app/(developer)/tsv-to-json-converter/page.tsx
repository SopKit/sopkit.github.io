import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSerialization from "@/components/tools/built-ins/BuiltInSerialization";

export const metadata = {
	title: "Free TSV to JSON Converter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free TSV to JSON Converter online. Secure, local developer utility with no registration. 100% free.",
	keywords: "tsv to json converter, free online tool, no signup, tsv to json converter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/tsv-to-json-converter",
	},
	openGraph: {
		title: "Free TSV to JSON Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free TSV to JSON Converter online. Secure, local developer utility with no registration. 100% free.",
		url: "https://sopkit.github.io/tsv-to-json-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free TSV to JSON Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free TSV to JSON Converter online. Secure, local developer utility with no registration. 100% free.",
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
