/**
 * YouTube hub grouping for src/app/(youtube)/youtube-tools/page.tsx.
 *
 * Kept in a pure data module (no component imports) so tests can verify
 * coverage without rendering a client component: every tool in the
 * `youtube` registry category must appear in exactly one group, and
 * every grouped id must resolve to a real registry tool. The groups are
 * derived from the tool ids/names only — no tool is renamed or invented.
 */
export interface YoutubeHubGroup {
	heading: string;
	blurb: string;
	toolIds: string[];
}

export const YOUTUBE_HUB_GROUPS: YoutubeHubGroup[] = [
	{
		heading: "Download & save",
		blurb: "Video, Shorts, thumbnail and channel-art downloads.",
		toolIds: [
			"youtube-thumbnail-downloader",
		],
	},
	{
		heading: "Channel research",
		blurb: "Look up channels, check statistics, and compare counts.",
		toolIds: [
			"youtube-money-calculator",
		],
	},
	{
		heading: "Titles, tags & descriptions",
		blurb: "Write and measure titles, tags, hashtags and descriptions.",
		toolIds: [
			"youtube-title-generator",
			"youtube-title-capitalizer",
			"youtube-title-length-checker",
			"youtube-description-generator",
			"youtube-thumbnail-text-generator",
		],
	},
	{
		heading: "Links & embeds",
		blurb: "Build share links, embed codes and playlist links.",
		toolIds: [
			"youtube-subscribe-link-generator",
			"youtube-timestamp-link-generator",
			"youtube-embed-code-generator",
		],
	},
];
