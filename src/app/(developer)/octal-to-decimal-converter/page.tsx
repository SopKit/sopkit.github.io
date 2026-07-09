import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Octal to Decimal Converter Online Free - Developer Tools | SopKit",
	description: "Convert octal numbers to decimal (Base-10) instantly. Our free online tool makes it easy to transform numeric bases for programming and mathematical calculations. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/octal-to-decimal-converter/",
	},
	openGraph: {
		title: "Octal to Decimal Converter Online Free - No Signup",
		description: "Convert octal numbers to decimal (Base-10) instantly. Our free online tool makes it easy to transform numeric bases for programming and mathematical calculation",
		url: "https://sopkit.github.io/octal-to-decimal-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Octal to Decimal Converter Online Free - Fast & Secure",
		description: "Convert octal numbers to decimal (Base-10) instantly. Our free online tool makes it easy to transform numeric bases for programming and mathematical calculation",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/octal-to-decimal-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="octal-to-decimal" />
		</ToolLayout>
	);
}
