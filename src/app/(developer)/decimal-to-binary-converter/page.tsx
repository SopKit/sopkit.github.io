import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Decimal to Binary Converter Online Free - Developer Tools | SopKit",
	description: "Convert decimal numbers (Base-10) to binary code (Base-2) instantly. Our free online converter is perfect for students, developers, and data analysis tasks. Fast, secure, and accurate. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/decimal-to-binary-converter",
	},
	openGraph: {
		title: "Decimal to Binary Converter Online Free - No Signup",
		description: "Convert decimal numbers (Base-10) to binary code (Base-2) instantly. Our free online converter is perfect for students, developers, and data analysis tasks. Fas",
		url: "https://sopkit.github.io/decimal-to-binary-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Decimal to Binary Converter Online Free - Fast & Secure",
		description: "Convert decimal numbers (Base-10) to binary code (Base-2) instantly. Our free online converter is perfect for students, developers, and data analysis tasks. Fas",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/decimal-to-binary-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="decimal-to-binary" />
		</ToolLayout>
	);
}
