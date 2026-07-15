import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free URL Encoder Decoder Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free URL Encoder Decoder online. Fast and private browser utility with no signup. Free & secure.",
	keywords: "url encoder decoder, free online tool, no signup, url encoder decoder online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/url-encoder-decoder",
	},
	openGraph: {
		title: "Free URL Encoder Decoder Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free URL Encoder Decoder online. Fast and private browser utility with no signup. Free & secure.",
		url: "https://sopkit.github.io/url-encoder-decoder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free URL Encoder Decoder Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free URL Encoder Decoder online. Fast and private browser utility with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/url-encoder-decoder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
