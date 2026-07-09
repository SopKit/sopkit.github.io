import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Decimal to HEX Converter Online Free - Developer Tools | SopKit",
	description: "Transform decimal numbers into hexadecimal format instantly. Our free online tool is perfect for web development, low-level programming, and color code analysis. Fast and private. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/decimal-to-hex-converter/",
	},
	openGraph: {
		title: "Decimal to HEX Converter Online Free - No Signup",
		description: "Transform decimal numbers into hexadecimal format instantly. Our free online tool is perfect for web development, low-level programming, and color code analysis",
		url: "https://sopkit.github.io/decimal-to-hex-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Decimal to HEX Converter Online Free - Fast & Secure",
		description: "Transform decimal numbers into hexadecimal format instantly. Our free online tool is perfect for web development, low-level programming, and color code analysis",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/decimal-to-hex-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="decimal-to-hex" />
		</ToolLayout>
	);
}
