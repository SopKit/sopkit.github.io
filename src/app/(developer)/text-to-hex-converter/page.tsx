import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Text to HEX Converter Online Free - Developer Tools | SopKit",
	description: "Convert plain text into hexadecimal format instantly. Our free online tool provides a clean hex representation of your input string for development and data analysis. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-hex-converter",
	},
	openGraph: {
		title: "Text to HEX Converter Online Free - No Signup",
		description: "Convert plain text into hexadecimal format instantly. Our free online tool provides a clean hex representation of your input string for development and data ana",
		url: "https://sopkit.github.io/text-to-hex-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Text to HEX Converter Online Free - Fast & Secure",
		description: "Convert plain text into hexadecimal format instantly. Our free online tool provides a clean hex representation of your input string for development and data ana",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/text-to-hex-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BaseConverter converterKind="text-to-hex" />
		</ToolLayout>
	);
}
