import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "HTML Minifier Online Free - Developer Tools | SopKit",
	description: "Compress and minify your HTML code to improve website speed. Our free online tool removes unnecessary whitespace, comments, and line breaks for faster page load times. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/html-minifier/",
	},
	openGraph: {
		title: "HTML Minifier Online Free - No Signup",
		description: "Compress and minify your HTML code to improve website speed. Our free online tool removes unnecessary whitespace, comments, and line breaks for faster page load",
		url: "https://sopkit.github.io/html-minifier",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "HTML Minifier Online Free - Fast & Secure",
		description: "Compress and minify your HTML code to improve website speed. Our free online tool removes unnecessary whitespace, comments, and line breaks for faster page load",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/html-minifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="html-minifier" />
		</ToolLayout>
	);
}
