import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "URL Encoder Decoder Online - Free URL Tool | SopKit",
	description: "Encode or decode URLs and parameter query strings instantly. Safe, secure, and executed fully client-side in your browser. No registration required.",
	alternates: {
		canonical: "https://sopkit.github.io/url-encoder-decoder",
	},
	openGraph: {
		title: "URL Encoder Decoder Online - Free URL Tool | SopKit",
		description: "Encode or decode URLs and parameter query strings instantly. Safe, secure, and executed fully client-side in your browser. No registration required.",
		url: "https://sopkit.github.io/url-encoder-decoder",
		siteName: "SopKit",
		images: [{ url: "/og-images/text-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "URL Encoder Decoder Online - Free URL Tool | SopKit",
		description: "Encode or decode URLs and parameter query strings instantly. Safe, secure, and executed fully client-side in your browser. No registration required.",
		images: ["/og-images/text-tools.png"],
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
