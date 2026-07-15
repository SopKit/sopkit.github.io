import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CodeFormatterTool from "@/components/tools/developer/CodeFormatterTool";

export const metadata = {
	title: "Free Code Formatter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free Code Formatter online. Secure, local developer utility with no registration. Try it free now.",
	keywords: "code formatter, free online tool, no signup, code formatter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/code-formatter",
	},
	openGraph: {
		title: "Free Code Formatter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Code Formatter online. Secure, local developer utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/code-formatter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Code Formatter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Code Formatter online. Secure, local developer utility with no registration. Try it free now.",
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
			<CodeFormatterTool />
		</ToolLayout>
	);
}
