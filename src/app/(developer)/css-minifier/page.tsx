import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "Free CSS Minifier Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free CSS Minifier online. Secure, local developer utility with no registration. No signup required.",
	keywords: "css minifier, free online tool, no signup, css minifier online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/css-minifier",
	},
	openGraph: {
		title: "Free CSS Minifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free CSS Minifier online. Secure, local developer utility with no registration. No signup required.",
		url: "https://sopkit.github.io/css-minifier",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free CSS Minifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free CSS Minifier online. Secure, local developer utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/css-minifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="css-minifier" />
		</ToolLayout>
	);
}
