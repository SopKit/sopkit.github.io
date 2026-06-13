import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FacebookDownloader from "@/components/tools/downloaders/FacebookDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Fb Clip Downloader Online - No Signup | SopKit",
	description: "Download Facebook video clips and highlights in high resolution instantly. Our free online downloader is fast, secure, and easy to use. No signup required...",
	keywords: "fb clip downloader, free online tool, no signup, fb-clip-downloader, free fb-clip-downloader, Fb Clip Downloader online, YouTube tool, free YouTube utility, YouTube optimizer, video analytics, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/fb-clip-downloader",
	},
	openGraph: {
		title: "Free Fb Clip Downloader Online - No Signup | SopKit",
		description: "Download Facebook video clips and highlights in high resolution instantly. Our free online downloader is fast, secure, and easy to use. No signup required...",
		url: "https://sopkit.github.io/fb-clip-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Fb Clip Downloader Online - No Signup | SopKit",
		description: "Download Facebook video clips and highlights in high resolution instantly. Our free online downloader is fast, secure, and easy to use. No signup required...",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/fb-clip-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FacebookDownloader />
		</ToolLayout>
	);
}
