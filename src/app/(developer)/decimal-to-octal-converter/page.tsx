import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Decimal to Octal Converter Online Free - Developer Tools | SopKit",
	description: "Convert decimal numbers to octal format instantly. Our free online converter provides quick and accurate base transformations for computer science and technical tasks. No signup required. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/decimal-to-octal-converter",
	},
	openGraph: {
		title: "Decimal to Octal Converter Online Free - No Signup",
		description: "Convert decimal numbers to octal format instantly. Our free online converter provides quick and accurate base transformations for computer science and technical",
		url: "https://sopkit.github.io/decimal-to-octal-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Decimal to Octal Converter Online Free - Fast & Secure",
		description: "Convert decimal numbers to octal format instantly. Our free online converter provides quick and accurate base transformations for computer science and technical",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/decimal-to-octal-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BaseConverter converterKind="decimal-to-octal" />
		</ToolLayout>
	);
}
