export const dynamic = "force-static";

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
