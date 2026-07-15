import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "Free JavaScript Minifier Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JavaScript Minifier online. Secure, local developer utility with no registration. Easy to use.",
	keywords: "javascript minifier, free online tool, no signup, javascript minifier online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/javascript-minifier",
	},
	openGraph: {
		title: "Free JavaScript Minifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JavaScript Minifier online. Secure, local developer utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/javascript-minifier",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JavaScript Minifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JavaScript Minifier online. Secure, local developer utility with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/javascript-minifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="javascript-minifier" />
		</ToolLayout>
	);
}
