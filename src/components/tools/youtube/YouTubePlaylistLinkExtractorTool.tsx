"use client";

import { useMemo, useState } from "react";
import { Download, Link as LinkIcon, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PlaylistItem {
  index: number;
  position: number;
  videoId: string;
  videoUrl: string;
  title: string;
  publishedAt: string;
}

interface PlaylistResponse {
  playlistId: string;
  totalResults: number;
  items: PlaylistItem[];
}

export default function YouTubePlaylistLinkExtractorTool() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
  const [error, setError] = useState("");

  const hasResults = playlist?.items?.length > 0;
  const csvContent = useMemo(() => {
    if (!hasResults || !playlist) return "";

    const header = ["Index", "Video ID", "Video URL", "Title", "Published At"];
    const rows = playlist.items.map((item) => [
      String(item.position + 1),
      item.videoId,
      item.videoUrl,
      item.title.replace(/"/g, '""'),
      item.publishedAt,
    ]);

    return [header.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    ].join("\n");
  }, [hasResults, playlist]);

  const handleExtract = async () => {
    if (!url.trim()) {
      setError("Please enter a playlist URL or playlist ID.");
      return;
    }

    setIsLoading(true);
    setError("");
    setPlaylist(null);

    try {
      const response = await fetch(`/api/youtube-playlist-links?url=${encodeURIComponent(url.trim())}`);
      const json = await response.json();

      if (!response.ok || json.error) {
        throw new Error(json.error || "Unable to extract playlist links.");
      }

      if (!json.data?.items?.length) {
        throw new Error("No videos found for this playlist.");
      }

      setPlaylist(json.data);
      toast.success("Playlist extracted successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Extraction failed.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCsv = () => {
    if (!csvContent) return;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const urlBlob = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlBlob;
    link.download = `youtube-playlist-${playlist?.playlistId || "export"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(urlBlob);
  };

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            YouTube Playlist Link Extractor
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Paste a playlist URL or playlist ID and get every video link, title, ID, and published date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              type="text"
              placeholder="https://www.youtube.com/playlist?list=PL... or PL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-14 flex-1"
              disabled={isLoading}
            />
            <Button
              type="button"
              onClick={handleExtract}
              disabled={isLoading}
              className="h-14 px-6"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Search className="mr-2 h-5 w-5" />
              )}
              Extract
            </Button>
          </div>

          {error ? (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          ) : null}

          {playlist && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-primary/5 p-4 border border-primary/10">
                <p className="text-sm text-muted-foreground">
                  Playlist ID: <span className="font-mono text-foreground">{playlist.playlistId}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Total videos: <span className="font-semibold">{playlist.totalResults}</span>
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Extracted Videos</h2>
                  <p className="text-sm text-muted-foreground">View details for each playlist video below.</p>
                </div>
                <Button type="button" onClick={downloadCsv} variant="secondary" className="h-12 px-4">
                  <Download className="mr-2 h-4 w-4" /> Download CSV
                </Button>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-border/50">
                <table className="min-w-full divide-y divide-border text-left">
                  <thead className="bg-slate-950/10">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-foreground">#</th>
                      <th className="px-4 py-3 text-sm font-semibold text-foreground">Title</th>
                      <th className="px-4 py-3 text-sm font-semibold text-foreground">Video ID</th>
                      <th className="px-4 py-3 text-sm font-semibold text-foreground">Published</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    {playlist.items.map((item) => (
                      <tr key={item.videoId} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 align-top text-sm text-muted-foreground">{item.position + 1}</td>
                        <td className="px-4 py-3 align-top text-sm">
                          <a
                            href={item.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                          >
                            <LinkIcon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </a>
                        </td>
                        <td className="px-4 py-3 align-top text-sm font-mono text-muted-foreground">{item.videoId}</td>
                        <td className="px-4 py-3 align-top text-sm text-muted-foreground">{new Date(item.publishedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
