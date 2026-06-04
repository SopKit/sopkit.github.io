import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UrlParserTool from "@/components/tools/built-ins/UrlParserTool";

export const metadata = {
	title: "URL Rewriting Tool Online Free - No Signup | SopKit",
	description: "Free url rewriting tool tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/url-rewriting-tool",
	},
	openGraph: {
		title: "URL Rewriting Tool Online Free - No Signup",
		description: "Free url rewriting tool tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based too",
		url: "https://sopkit.github.io/url-rewriting-tool",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "URL Rewriting Tool Online Free - Fast & Secure",
		description: "Free url rewriting tool tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based too",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/url-rewriting-tool");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<UrlParserTool />
		</ToolLayout>
	);
}
