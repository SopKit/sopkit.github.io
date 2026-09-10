import type { Metadata } from "next";
import { SITE_CONFIG } from "@/constants/config";

export const metadata: Metadata = {
	title: "Company | SopKit",
	description:
		`Learn about SopKit — our mission to provide ${SITE_CONFIG.toolCountString} free browser-based tools, contact information, privacy policy, and terms of service. Privacy-first, no registration required.`,
	keywords:
		"SopKit company, about SopKit, contact SopKit, privacy policy, terms of service, free online tools company, privacy focused tools, no signup tools",
	openGraph: {
		title: "Company | SopKit",
		description:
			"Learn about SopKit — our mission, contact details, privacy policy, and terms of service.",
		url: "https://sopkit.github.io/about/",
		siteName: "SopKit",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Company | SopKit",
		description:
			"Learn about SopKit — our mission, contact details, privacy policy, and terms of service.",
	},
};

export default function CompanyGroupLayout({
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
