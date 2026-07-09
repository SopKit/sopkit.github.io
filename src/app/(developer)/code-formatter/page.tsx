import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JSONFormatterTool from "@/components/tools/developer/JSONFormatterTool";

export const metadata = {
	title: "Code Formatter Online Free - Developer Tools | SopKit",
	description: "Format and beautify HTML, CSS, JavaScript, and SQL code. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/code-formatter/",
	},
	openGraph: {
		title: "Code Formatter Online Free - No Signup",
		description: "Format and beautify HTML, CSS, JavaScript, and SQL code. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/code-formatter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Code Formatter Online Free - Fast & Secure",
		description: "Format and beautify HTML, CSS, JavaScript, and SQL code. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/code-formatter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JSONFormatterTool />
		</ToolLayout>
	);
}
