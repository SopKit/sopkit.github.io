import type { Metadata } from "next";

export const dynamic = "force-static";

// Video embed shell — widget only, must stay out of search indices.
export const metadata: Metadata = {
	title: "Embedded Video Player — SopKit",
	description: "Embedded SopKit video player widget.",
	robots: { index: false, follow: false },
};

export default function EmbedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Minimal layout wrapper without duplicate html/body tags
	return (
		<div className="w-full min-h-screen bg-black text-white flex items-center justify-center p-0 m-0">
			{children}
		</div>
	);
}
