import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UrlParserTool from "@/components/tools/built-ins/UrlParserTool";

export const metadata = {
	title: "Free URL Rewriting Tool Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free URL Rewriting Tool online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "url rewriting tool, free online tool, no signup, url rewriting tool online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/url-rewriting-tool",
	},
	openGraph: {
		title: "Free URL Rewriting Tool Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free URL Rewriting Tool online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/url-rewriting-tool",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free URL Rewriting Tool Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free URL Rewriting Tool online. Fast, secure browser-based utility with no registration. 100% free and secure.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UrlParserTool />
		</ToolLayout>
	);
}
