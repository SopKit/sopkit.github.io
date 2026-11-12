import { buildCanonicalUrl } from "@/seo/canonical";

export const metadata = {
	title: "Free AI Generator Tools Online - No Signup | SopKit",
	description:
		"Free AI generator tools: create images from text prompts, generate natural voiceovers with text-to-speech, produce QR codes with logos, and build passwords.",
	openGraph: {
		title: "Free AI Generator Tools Online - No Signup | SopKit",
		description:
			"Generate AI images, voiceovers, QR codes, and passwords for free. Customizable, no watermarks, instant download.",
		url: buildCanonicalUrl("/generators"),
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Free AI Generator Tools",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Free AI Generator Tools Online - No Signup | SopKit",
		description:
			"Generate AI images, voiceovers, QR codes, and passwords for free. Customizable, no watermarks, instant download.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function GeneratorsLayout({
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
