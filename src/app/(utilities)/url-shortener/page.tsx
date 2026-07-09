import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import URLShortenerTool from "@/components/tools/utilities/URLShortenerTool";

export const metadata = {
	title: "URL Shortener Online Free - No Signup | SopKit",
	description: "Shorten long URLs for easier sharing No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/url-shortener/",
	},
	openGraph: {
		title: "URL Shortener Online Free - No Signup",
		description: "Shorten long URLs for easier sharing No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/url-shortener/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "URL Shortener Online Free - Fast & Secure",
		description: "Shorten long URLs for easier sharing No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/url-shortener");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<URLShortenerTool />
		</ToolLayout>
	);
}
