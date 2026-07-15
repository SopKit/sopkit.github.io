import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "Free HTML Beautifier Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free HTML Beautifier online. Secure, local developer utility with no registration. Try it free now.",
	keywords: "html beautifier, free online tool, no signup, html beautifier online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/html-beautifier",
	},
	openGraph: {
		title: "Free HTML Beautifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free HTML Beautifier online. Secure, local developer utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/html-beautifier",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTML Beautifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free HTML Beautifier online. Secure, local developer utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/html-beautifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="html-beautifier" />
		</ToolLayout>
	);
}
