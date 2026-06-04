import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Binary to HEX Converter Online Free - Developer Tools | SopKit",
	description: "Transform binary code into hexadecimal format instantly. Our free online tool is perfect for low-level programming, data analysis, and memory debugging. Fast and secure. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/binary-to-hex-converter",
	},
	openGraph: {
		title: "Binary to HEX Converter Online Free - No Signup",
		description: "Transform binary code into hexadecimal format instantly. Our free online tool is perfect for low-level programming, data analysis, and memory debugging. Fast an",
		url: "https://sopkit.github.io/binary-to-hex-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Binary to HEX Converter Online Free - Fast & Secure",
		description: "Transform binary code into hexadecimal format instantly. Our free online tool is perfect for low-level programming, data analysis, and memory debugging. Fast an",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/binary-to-hex-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BaseConverter converterKind="binary-to-hex" />
		</ToolLayout>
	);
}
