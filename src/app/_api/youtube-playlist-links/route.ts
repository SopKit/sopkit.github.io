import { NextResponse } from "next/server";
import { extractYouTubePlaylistId } from "@/lib/youtube-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") || "";
    const playlistId = extractYouTubePlaylistId(url);

    if (!playlistId) {
      return NextResponse.json(
        { success: false, error: "Invalid YouTube playlist URL or playlist ID." },
        { status: 400 },
      );
    }

    const apiUrl = `https://sanishtech.com/wp-json/sanish/v1/yt-playlist-links?q=${encodeURIComponent(
      playlistId,
    )}`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch playlist data from the external API." },
        { status: response.status },
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.items)) {
      return NextResponse.json(
        { success: false, error: "Playlist data is not available or the playlist is private." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("YouTube playlist fetch error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while extracting playlist links." },
      { status: 500 },
    );
  }
}
