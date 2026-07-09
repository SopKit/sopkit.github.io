import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Views Ratio Calculator Online Free - No Signup | SopKit",
	description: "Calculate the view-to-engagement ratio for any YouTube video instantly. Our free online tool helps you understand audience interaction and video performance beyond just views. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-views-ratio-calculator/",
	},
	openGraph: {
		title: "YouTube Views Ratio Calculator Online Free - No Signup",
		description: "Calculate the view-to-engagement ratio for any YouTube video instantly. Our free online tool helps you understand audience interaction and video performance bey",
		url: "https://sopkit.github.io/youtube-views-ratio-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Views Ratio Calculator Online Free - Fast & Secure",
		description: "Calculate the view-to-engagement ratio for any YouTube video instantly. Our free online tool helps you understand audience interaction and video performance bey",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-views-ratio-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
