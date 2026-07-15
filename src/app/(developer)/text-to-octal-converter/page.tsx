import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Free Text to Octal Converter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free Text to Octal Converter online. Secure, local developer utility with no registration.",
	keywords: "text to octal converter, free online tool, no signup, text to octal converter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-octal-converter",
	},
	openGraph: {
		title: "Free Text to Octal Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Text to Octal Converter online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/text-to-octal-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Text to Octal Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Text to Octal Converter online. Secure, local developer utility with no registration.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="text-to-octal" />
		</ToolLayout>
	);
}
