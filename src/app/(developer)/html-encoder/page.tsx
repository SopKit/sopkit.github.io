import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "Free HTML Encoder Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free HTML Encoder online. Secure, local developer utility with no registration. No signup required.",
	keywords: "html encoder, free online tool, no signup, html encoder online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/html-encoder",
	},
	openGraph: {
		title: "Free HTML Encoder Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free HTML Encoder online. Secure, local developer utility with no registration. No signup required.",
		url: "https://sopkit.github.io/html-encoder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTML Encoder Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free HTML Encoder online. Secure, local developer utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/html-encoder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="html-encoder" />
		</ToolLayout>
	);
}
