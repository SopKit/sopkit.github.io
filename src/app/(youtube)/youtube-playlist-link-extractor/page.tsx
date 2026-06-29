import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubePlaylistLinkExtractorTool from "@/components/tools/youtube/YouTubePlaylistLinkExtractorTool";

export const metadata = {
  title: "YouTube Playlist Link Extractor | Export Video Links to CSV",
  description:
    "Use the YouTube Playlist Link Extractor to pull video URLs from public playlists and download a CSV in one click. Ideal for audits, planning, and reporting.",
  alternates: {
    canonical: "https://sopkit.github.io/youtube-playlist-link-extractor/",
  },
  openGraph: {
    title: "YouTube Playlist Link Extractor | Export Video Links to CSV",
    description:
      "Use the YouTube Playlist Link Extractor to pull video URLs from public playlists and download a CSV in one click. Ideal for audits, planning, and reporting.",
    url: "https://sopkit.github.io/youtube-playlist-link-extractor",
    siteName: "SopKit",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Playlist Link Extractor | Export Video Links to CSV",
    description:
      "Use the YouTube Playlist Link Extractor to pull video URLs from public playlists and download a CSV in one click. Ideal for audits, planning, and reporting.",
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
