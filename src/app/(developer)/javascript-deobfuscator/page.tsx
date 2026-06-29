import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "JavaScript DeObfuscator Online Free - Developer Tools | SopKit",
	description: "Make obfuscated JavaScript code readable again instantly. Our free online DeObfuscator reverses common obfuscation techniques to help with code analysis and debugging. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/javascript-deobfuscator/",
	},
	openGraph: {
		title: "JavaScript DeObfuscator Online Free - No Signup",
		description: "Make obfuscated JavaScript code readable again instantly. Our free online DeObfuscator reverses common obfuscation techniques to help with code analysis and deb",
		url: "https://sopkit.github.io/javascript-deobfuscator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JavaScript DeObfuscator Online Free - Fast & Secure",
		description: "Make obfuscated JavaScript code readable again instantly. Our free online DeObfuscator reverses common obfuscation techniques to help with code analysis and deb",
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
