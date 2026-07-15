import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubePlaylistLinkExtractorTool from "@/components/tools/youtube/YouTubePlaylistLinkExtractorTool";

export const metadata = {
	title: "Free YouTube Playlist Link Extractor Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Playlist Link Extractor online. Fast, secure browser-based utility with no registration.",
	keywords: "youtube playlist link extractor, free online tool, no signup, youtube playlist link extractor online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-playlist-link-extractor",
	},
	openGraph: {
		title: "Free YouTube Playlist Link Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Playlist Link Extractor online. Fast, secure browser-based utility with no registration.",
		url: "https://sopkit.github.io/youtube-playlist-link-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Playlist Link Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Playlist Link Extractor online. Fast, secure browser-based utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
  const tool = getToolByRoute("/youtube-playlist-link-extractor");

  if (!tool) {
    return notFound();
  }

  return (
    <ToolLayout breadcrumbs={[]} tool={tool}>
      <YouTubePlaylistLinkExtractorTool />
    </ToolLayout>
  );
}
