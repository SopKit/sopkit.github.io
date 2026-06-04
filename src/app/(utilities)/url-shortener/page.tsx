import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import URLShortenerTool from "@/components/tools/utilities/URLShortenerTool";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free URL Shortener Online - No Signup | SopKit",
	description: "Shorten long URLs for easier sharing",
	keywords: "url shortener, shorten url, link shortener, short link, free url shortener, SopKit, url-shortener, free url-shortener, url shortener online, online utility, free converter, browser tool",
	alternates: {
		canonical: "https://sopkit.github.io/url-shortener",
	},
	openGraph: {
		title: "Free URL Shortener Online - No Signup | SopKit",
		description: "Shorten long URLs for easier sharing",
		url: "https://sopkit.github.io/url-shortener",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free URL Shortener Online - No Signup | SopKit",
		description: "Shorten long URLs for easier sharing",
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
		<ToolLayout tool={tool}>
			<URLShortenerTool />
		</ToolLayout>
	);
}
