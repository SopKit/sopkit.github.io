import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Decimal to Text Converter Online Free - Developer Tools | SopKit",
	description: "Convert decimal character codes back to readable text instantly. Our free online tool helps you decode numeric data streams and debug text processing tasks in your browser. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/decimal-to-text-converter/",
	},
	openGraph: {
		title: "Decimal to Text Converter Online Free - No Signup",
		description: "Convert decimal character codes back to readable text instantly. Our free online tool helps you decode numeric data streams and debug text processing tasks in y",
		url: "https://sopkit.github.io/decimal-to-text-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Decimal to Text Converter Online Free - Fast & Secure",
		description: "Convert decimal character codes back to readable text instantly. Our free online tool helps you decode numeric data streams and debug text processing tasks in y",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/decimal-to-text-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="decimal-to-text" />
		</ToolLayout>
	);
}
