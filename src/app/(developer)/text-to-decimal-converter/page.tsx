import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Text to Decimal Converter Online Free - Developer Tools | SopKit",
	description: "Convert text characters into their decimal numeric equivalents instantly. Our free online tool is useful for debugging character encoding and understanding data representations. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-decimal-converter",
	},
	openGraph: {
		title: "Text to Decimal Converter Online Free - No Signup",
		description: "Convert text characters into their decimal numeric equivalents instantly. Our free online tool is useful for debugging character encoding and understanding data",
		url: "https://sopkit.github.io/text-to-decimal-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Text to Decimal Converter Online Free - Fast & Secure",
		description: "Convert text characters into their decimal numeric equivalents instantly. Our free online tool is useful for debugging character encoding and understanding data",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/text-to-decimal-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="text-to-decimal" />
		</ToolLayout>
	);
}
