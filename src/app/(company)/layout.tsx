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

export const startupMetadata: Metadata = {
	title: "Startup & SaaS Submission Directories — Free List of 100+ Platforms | SopKit",
	description: "Curated list of 100+ startup directories, review sites, and communities to submit your software, AI tools, or developer products for free. Boost traffic and SEO.",
	openGraph: {
		title: "Startup & SaaS Submission Directories — Free List | SopKit",
		description: "Curated list of 100+ startup directories, review sites, and communities to submit your software or AI tools for free.",
		url: "https://sopkit.github.io/startup-directories/",
		siteName: "SopKit",
		type: "website",
	},
};

export const packagesMetadata: Metadata = {
	title: "SopKit Developer Packages — Free Zero-Dependency NPM Libraries",
	description: "Browse SopKit's open-source @sopkit NPM packages — base64, UUID, slug, color, validator, and more. Zero-dependency, strictly-typed, ESM+CJS dual-format.",
	openGraph: {
		title: "SopKit Developer Packages — Free Zero-Dependency NPM Libraries",
		description: "Browse SopKit's open-source @sopkit NPM packages — base64, UUID, slug, color, validator, and more.",
		url: "https://sopkit.github.io/packages/",
		siteName: "SopKit",
		type: "website",
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
