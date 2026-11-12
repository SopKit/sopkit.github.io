import { buildCanonicalUrl } from "@/seo/canonical";

export const metadata = {
	title: "Free Video Tools Online - No Signup | SopKit",
	description:
		"Free online video tools: play and download Terabox videos, compress video files, convert between MP4/AVI/MOV/WEBM/GIF, and trim clips. Browser-based, no signup.",
	openGraph: {
		title: "Free Video Tools Online - No Signup | SopKit",
		description:
			"Play Terabox videos, compress, convert, and trim video files for free. Browser-based, no signup, no watermarks.",
		url: buildCanonicalUrl("/video-tools"),
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1024,
				height: 541,
				alt: "Free Video Tools Collection",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Free Video Tools Online - No Signup | SopKit",
		description:
			"Play Terabox videos, compress, convert, and trim video files for free. Browser-based, no signup, no watermarks.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function VideoToolsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
			<main className="flex-1">{children}</main>
		</div>
	);
}
