import { buildCanonicalUrl } from "@/seo/canonical";

export const metadata = {
	title: "Free Image Tools Online - No Signup | SopKit",
	description:
		"Free online image tools: remove backgrounds with AI, compress and resize photos, convert between PNG/JPG/WEBP/SVG, and enhance image quality.",
	openGraph: {
		title: "Free Image Tools Online - No Signup | SopKit",
		description:
			"Remove backgrounds, compress, resize, and convert images with free AI-powered tools. Batch processing, no watermarks, no signup.",
		url: buildCanonicalUrl("/image-tools"),
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1024,
				height: 541,
				alt: "Free Image Tools Collection",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Image Tools - Free AI Photo Editing Suite",
		description:
			"Edit, convert, and enhance your photos with our free AI-powered tools. Remove backgrounds, compress, resize, and convert images instantly.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ImageToolsLayout({
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
