import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubePlaylistLinkExtractorTool from "@/components/tools/youtube/YouTubePlaylistLinkExtractorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "YouTube Playlist Link Extractor",
	description: "Private YouTube Playlist Link Extractor: privately generate YouTube content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/youtube-playlist-link-extractor",
	category: "youtube",
});

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
