import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JSONFormatterTool from "@/components/tools/developer/JSONFormatterTool";

export const metadata = {
	title: "Free JSON Formatter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JSON Formatter online. Secure, local developer utility with no registration. Try it free now.",
	keywords: "json formatter, free online tool, no signup, json formatter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/json-formatter",
	},
	openGraph: {
		title: "Free JSON Formatter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON Formatter online. Secure, local developer utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/json-formatter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JSON Formatter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON Formatter online. Secure, local developer utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-formatter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JSONFormatterTool />
		</ToolLayout>
	);
}
