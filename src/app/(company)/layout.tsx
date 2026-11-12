import { buildCanonicalUrl } from "@/seo/canonical";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/constants/config";

export const metadata: Metadata = {
	title: "Company | SopKit",
	description:
		`Learn about SopKit — our mission to provide ${SITE_CONFIG.toolCountString} free browser-based tools, contact information, privacy policy, and terms of service. Privacy-first, no registration required.`,
	openGraph: {
		title: "Company | SopKit",
		description:
			"Learn about SopKit — our mission to provide free browser-based tools, contact details, privacy policy, and terms of service.",
		url: buildCanonicalUrl("/about"),
		siteName: "SopKit",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Company | SopKit",
		description:
			"Learn about SopKit — our mission to provide free browser-based tools, contact details, privacy policy, and terms of service.",
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
