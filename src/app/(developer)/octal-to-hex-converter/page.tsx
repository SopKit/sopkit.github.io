import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Octal to HEX Converter Online Free - Developer Tools | SopKit",
	description: "Transform octal values into hexadecimal format instantly. Our free online converter is perfect for low-level programming and memory address transformations. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/octal-to-hex-converter/",
	},
	openGraph: {
		title: "Octal to HEX Converter Online Free - No Signup",
		description: "Transform octal values into hexadecimal format instantly. Our free online converter is perfect for low-level programming and memory address transformations. No ",
		url: "https://sopkit.github.io/octal-to-hex-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Octal to HEX Converter Online Free - Fast & Secure",
		description: "Transform octal values into hexadecimal format instantly. Our free online converter is perfect for low-level programming and memory address transformations. No ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/octal-to-hex-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="octal-to-hex" />
		</ToolLayout>
	);
}
