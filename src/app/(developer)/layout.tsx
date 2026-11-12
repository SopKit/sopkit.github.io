import { buildCanonicalUrl } from "@/seo/canonical";

export const metadata = {
	title: "Free Developer Tools Online - No Signup | SopKit",
	description:
		"Free developer tools for JSON formatting, Base64 encoding, JWT decoding, and hash generation. Your code never leaves the browser.",
	openGraph: {
		title: "Free Developer Tools Online - No Signup | SopKit",
		description:
			"Essential developer tools for JSON, JWT, Base64, hashing, and more. Secure client-side processing with no signup.",
		url: buildCanonicalUrl("/developer-tools"),
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Free Developer Tools Collection",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Free Developer Tools Online - No Signup | SopKit",
		description:
			"Essential developer tools for JSON, JWT, Base64, hashing, and more. Secure client-side processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function DeveloperToolsLayout({
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
