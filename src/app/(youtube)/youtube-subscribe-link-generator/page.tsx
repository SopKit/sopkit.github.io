import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeSubscribeLinkGeneratorTool from "@/components/tools/youtube/YouTubeSubscribeLinkGeneratorTool";

export const metadata = {
	title: "YouTube Subscribe Link Generator Online Free - No Signup | SopKit",
	description: "Create a direct YouTube subscribe link for your channel instantly. Our free online tool helps you boost your subscriber count with one-click links for social media and bios. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-subscribe-link-generator/",
	},
	openGraph: {
		title: "YouTube Subscribe Link Generator Online Free - No Signup",
		description: "Create a direct YouTube subscribe link for your channel instantly. Boost subscribers with one-click confirmation links for your bio and social posts. Free, no signup.",
		url: "https://sopkit.github.io/youtube-subscribe-link-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Subscribe Link Generator Online Free - Fast & Secure",
		description: "Create a direct YouTube subscribe link for your channel instantly. Boost subscribers with one-click confirmation links for your bio and social posts. Free, no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-subscribe-link-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeSubscribeLinkGeneratorTool />
		</ToolLayout>
	);
}
