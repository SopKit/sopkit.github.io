import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "HEX to Octal Converter Online Free - Developer Tools | SopKit",
	description: "Convert hexadecimal values to octal format instantly. Our free online converter helps with computer science base transformations and data processing in your browser. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/hex-to-octal-converter/",
	},
	openGraph: {
		title: "HEX to Octal Converter Online Free - No Signup",
		description: "Convert hexadecimal values to octal format instantly. Our free online converter helps with computer science base transformations and data processing in your bro",
		url: "https://sopkit.github.io/hex-to-octal-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "HEX to Octal Converter Online Free - Fast & Secure",
		description: "Convert hexadecimal values to octal format instantly. Our free online converter helps with computer science base transformations and data processing in your bro",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/hex-to-octal-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="hex-to-octal" />
		</ToolLayout>
	);
}
