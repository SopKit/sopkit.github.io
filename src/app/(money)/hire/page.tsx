import { permanentRedirect } from "next/navigation";


export const metadata = {
	title: "Hire Online Free | SopKit",
	description: "Free online Hire tool. Fast, secure, and privacy-focused browser utility. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/hire/",
	},
	openGraph: {
		title: "Hire Online Free - No Signup | SopKit",
		description: "Free online Hire tool. Fast, secure, and privacy-focused browser utility. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/hire/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Hire Online Free - Fast & Secure",
		description: "Free online Hire tool. Fast, secure, and privacy-focused browser utility. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function HireRedirect() {
	permanentRedirect("/services");
}
