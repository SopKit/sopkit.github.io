import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free HTML Minifier Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free HTML Minifier online. Secure, local developer utility with no registration. Try it free now.",
	keywords: "html minifier, free online tool, no signup, html minifier online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/html-minifier",
	},
	openGraph: {
		title: "Free HTML Minifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free HTML Minifier online. Secure, local developer utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/html-minifier",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTML Minifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free HTML Minifier online. Secure, local developer utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/html-minifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
