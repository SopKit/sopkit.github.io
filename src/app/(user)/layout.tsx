import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "User Area | SopKit",
	description:
		"Manage your SopKit account, saved preferences, and dashboard settings.",
	keywords:
		"SopKit account, user dashboard, profile settings, creator dashboard, saved tools, tool preferences",
	openGraph: {
		title: "User Area | SopKit",
		description: "Manage your SopKit account, preferences, and dashboard.",
		url: "https://sopkit.github.io/account",
		siteName: "SopKit",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
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
