import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Octal to Text Converter Online Free - Developer Tools | SopKit",
	description: "Convert octal character codes back to readable text instantly. Our free online tool helps you decode data streams and debug text processing tasks in your browser. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/octal-to-text-converter/",
	},
	openGraph: {
		title: "Octal to Text Converter Online Free - No Signup",
		description: "Convert octal character codes back to readable text instantly. Our free online tool helps you decode data streams and debug text processing tasks in your browse",
		url: "https://sopkit.github.io/octal-to-text-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Octal to Text Converter Online Free - Fast & Secure",
		description: "Convert octal character codes back to readable text instantly. Our free online tool helps you decode data streams and debug text processing tasks in your browse",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/octal-to-text-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="octal-to-text" />
		</ToolLayout>
	);
}
