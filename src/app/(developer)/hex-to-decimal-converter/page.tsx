import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "HEX to Decimal Converter Online Free - Developer Tools | SopKit",
	description: "Convert hexadecimal numbers to decimal (Base-10) instantly. Our free online tool provides quick and accurate base conversions for programming and memory address analysis. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/hex-to-decimal-converter/",
	},
	openGraph: {
		title: "HEX to Decimal Converter Online Free - No Signup",
		description: "Convert hexadecimal numbers to decimal (Base-10) instantly. Our free online tool provides quick and accurate base conversions for programming and memory address",
		url: "https://sopkit.github.io/hex-to-decimal-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "HEX to Decimal Converter Online Free - Fast & Secure",
		description: "Convert hexadecimal numbers to decimal (Base-10) instantly. Our free online tool provides quick and accurate base conversions for programming and memory address",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/hex-to-decimal-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="hex-to-decimal" />
		</ToolLayout>
	);
}
