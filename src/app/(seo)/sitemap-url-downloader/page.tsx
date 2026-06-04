import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "Sitemap Url Downloader Online Free - No Signup | SopKit",
	description: "Free Sitemap Url Downloader online. Sitemap Url Downloader allows you to optimize your website quickly and easily. 100% free, no signup required, and privacy-focused processing in your browser. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/sitemap-url-downloader",
	},
	openGraph: {
		title: "Sitemap Url Downloader Online Free - No Signup",
		description: "Free Sitemap Url Downloader online. Sitemap Url Downloader allows you to optimize your website quickly and easily. 100% free, no signup required, and privacy-fo",
		url: "https://sopkit.github.io/sitemap-url-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Sitemap Url Downloader Online Free - Fast & Secure",
		description: "Free Sitemap Url Downloader online. Sitemap Url Downloader allows you to optimize your website quickly and easily. 100% free, no signup required, and privacy-fo",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/sitemap-url-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<DownloaderEngine />
		</ToolLayout>
	);
}
