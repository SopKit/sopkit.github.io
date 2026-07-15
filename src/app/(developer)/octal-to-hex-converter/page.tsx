import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Free Octal to HEX Converter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free Octal to HEX Converter online. Secure, local developer utility with no registration.",
	keywords: "octal to hex converter, free online tool, no signup, octal to hex converter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/octal-to-hex-converter",
	},
	openGraph: {
		title: "Free Octal to HEX Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Octal to HEX Converter online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/octal-to-hex-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Octal to HEX Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Octal to HEX Converter online. Secure, local developer utility with no registration.",
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
