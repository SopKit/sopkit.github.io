import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "Free JavaScript DeObfuscator Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JavaScript DeObfuscator online. Secure, local developer utility with no registration.",
	keywords: "javascript deobfuscator, free online tool, no signup, javascript deobfuscator online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/javascript-deobfuscator",
	},
	openGraph: {
		title: "Free JavaScript DeObfuscator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JavaScript DeObfuscator online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/javascript-deobfuscator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JavaScript DeObfuscator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JavaScript DeObfuscator online. Secure, local developer utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/javascript-deobfuscator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="javascript-deobfuscator" />
		</ToolLayout>
	);
}
