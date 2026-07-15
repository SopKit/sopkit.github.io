import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Free Decimal to Octal Converter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free Decimal to Octal Converter online. Secure, local developer utility with no registration.",
	keywords: "decimal to octal converter, free online tool, no signup, decimal to octal converter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/decimal-to-octal-converter",
	},
	openGraph: {
		title: "Free Decimal to Octal Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Decimal to Octal Converter online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/decimal-to-octal-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Decimal to Octal Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Decimal to Octal Converter online. Secure, local developer utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/decimal-to-octal-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="decimal-to-octal" />
		</ToolLayout>
	);
}
