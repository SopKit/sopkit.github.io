import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Binary to Decimal Converter Online Free - Developer Tools | SopKit",
	description: "Convert binary numbers to decimal (Base-10) instantly. Our free online converter helps you with computer science calculations and binary data analysis in seconds. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/binary-to-decimal-converter/",
	},
	openGraph: {
		title: "Binary to Decimal Converter Online Free - No Signup",
		description: "Convert binary numbers to decimal (Base-10) instantly. Our free online converter helps you with computer science calculations and binary data analysis in second",
		url: "https://sopkit.github.io/binary-to-decimal-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Binary to Decimal Converter Online Free - Fast & Secure",
		description: "Convert binary numbers to decimal (Base-10) instantly. Our free online converter helps you with computer science calculations and binary data analysis in second",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/binary-to-decimal-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="binary-to-decimal" />
		</ToolLayout>
	);
}
