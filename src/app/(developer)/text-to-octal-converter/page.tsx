import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Text to Octal Converter Online Free - Developer Tools | SopKit",
	description: "Convert text into octal numeric values instantly. Our free online converter provides base-8 representations for every character in your text for technical analysis. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-octal-converter",
	},
	openGraph: {
		title: "Text to Octal Converter Online Free - No Signup",
		description: "Convert text into octal numeric values instantly. Our free online converter provides base-8 representations for every character in your text for technical analy",
		url: "https://sopkit.github.io/text-to-octal-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Text to Octal Converter Online Free - Fast & Secure",
		description: "Convert text into octal numeric values instantly. Our free online converter provides base-8 representations for every character in your text for technical analy",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/text-to-octal-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BaseConverter converterKind="text-to-octal" />
		</ToolLayout>
	);
}
