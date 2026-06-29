import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "JavaScript Obfuscator Online Free - Developer Tools | SopKit",
	description: "Protect your JavaScript code by making it difficult to read and reverse-engineer. Our free online Obfuscator helps secure your intellectual property and prevent unauthorized script modification. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/javascript-obfuscator/",
	},
	openGraph: {
		title: "JavaScript Obfuscator Online Free - No Signup",
		description: "Protect your JavaScript code by making it difficult to read and reverse-engineer. Our free online Obfuscator helps secure your intellectual property and prevent",
		url: "https://sopkit.github.io/javascript-obfuscator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JavaScript Obfuscator Online Free - Fast & Secure",
		description: "Protect your JavaScript code by making it difficult to read and reverse-engineer. Our free online Obfuscator helps secure your intellectual property and prevent",
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
