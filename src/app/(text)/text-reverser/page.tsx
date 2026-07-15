import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Text Reverser Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Text Reverser online. Fast and private browser utility with no signup. 100% free and secure.",
	keywords: "text reverser, free online tool, no signup, text reverser online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/text-reverser",
	},
	openGraph: {
		title: "Free Text Reverser Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Text Reverser online. Fast and private browser utility with no signup. 100% free and secure.",
		url: "https://sopkit.github.io/text-reverser",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Text Reverser Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Text Reverser online. Fast and private browser utility with no signup. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/text-reverser");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
