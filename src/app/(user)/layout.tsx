import { buildCanonicalUrl } from "@/seo/canonical";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "User Area | SopKit",
	description:
		"Manage your SopKit account, saved preferences, and dashboard settings.",
	openGraph: {
		title: "User Area | SopKit",
		description: "Manage your SopKit account, preferences, and dashboard.",
		url: buildCanonicalUrl("/account"),
		siteName: "SopKit",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "User Area | SopKit",
		description: "Manage your SopKit account, preferences, and dashboard.",
	},
};

export default function UserGroupLayout({
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
