import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Octal to Binary Converter Online Free - Developer Tools | SopKit",
	description: "Convert octal numbers to binary code instantly. Our free online converter provides fast and accurate base transformations for computer science students and developers. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/octal-to-binary-converter/",
	},
	openGraph: {
		title: "Octal to Binary Converter Online Free - No Signup",
		description: "Convert octal numbers to binary code instantly. Our free online converter provides fast and accurate base transformations for computer science students and deve",
		url: "https://sopkit.github.io/octal-to-binary-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Octal to Binary Converter Online Free - Fast & Secure",
		description: "Convert octal numbers to binary code instantly. Our free online converter provides fast and accurate base transformations for computer science students and deve",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/octal-to-binary-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="octal-to-binary" />
		</ToolLayout>
	);
}
