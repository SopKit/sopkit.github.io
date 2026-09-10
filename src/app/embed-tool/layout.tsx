import type { Metadata } from "next";

// Embeddable widget shell — never indexed, only framed into partner pages.
export const metadata: Metadata = {
	title: "Embedded Tool — SopKit",
	description: "Embedded SopKit tool widget.",
	robots: { index: false, follow: false },
};

export default function EmbedToolLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
