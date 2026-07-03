import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "HTML Entity Encoder/Decoder Online Free | SopKit",
	description: "Encode or decode HTML entities to prevent XSS or display special characters safely. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/html-entity-encoder",
	},
	openGraph: {
		title: "HTML Entity Encoder/Decoder Online Free - No Signup | SopKit",
		description: "Encode or decode HTML entities to prevent XSS or display special characters safely. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/html-entity-encoder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "HTML Entity Encoder/Decoder Online Free - Fast & Secure",
		description: "Encode or decode HTML entities to prevent XSS or display special characters safely. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/html-entity-encoder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
