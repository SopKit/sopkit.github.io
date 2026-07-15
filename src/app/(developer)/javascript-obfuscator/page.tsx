import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "Free JavaScript Obfuscator Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JavaScript Obfuscator online. Secure, local developer utility with no registration. 100% free.",
	keywords: "javascript obfuscator, free online tool, no signup, javascript obfuscator online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/javascript-obfuscator",
	},
	openGraph: {
		title: "Free JavaScript Obfuscator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JavaScript Obfuscator online. Secure, local developer utility with no registration. 100% free.",
		url: "https://sopkit.github.io/javascript-obfuscator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JavaScript Obfuscator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JavaScript Obfuscator online. Secure, local developer utility with no registration. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/javascript-obfuscator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="javascript-obfuscator" />
		</ToolLayout>
	);
}
