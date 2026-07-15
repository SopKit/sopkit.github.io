import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Free Text to HEX Converter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free Text to HEX Converter online. Secure, local developer utility with no registration. 100% free.",
	keywords: "text to hex converter, free online tool, no signup, text to hex converter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-hex-converter",
	},
	openGraph: {
		title: "Free Text to HEX Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Text to HEX Converter online. Secure, local developer utility with no registration. 100% free.",
		url: "https://sopkit.github.io/text-to-hex-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Text to HEX Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Text to HEX Converter online. Secure, local developer utility with no registration. 100% free.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="text-to-hex" />
		</ToolLayout>
	);
}
