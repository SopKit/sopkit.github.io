import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free HTML Entity Encoder/Decoder Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free HTML Entity Encoder/Decoder online. Secure, local developer utility with no registration.",
	keywords: "html entity encoder/decoder, free online tool, no signup, html entity encoder/decoder online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/html-entity-encoder",
	},
	openGraph: {
		title: "Free HTML Entity Encoder/Decoder Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free HTML Entity Encoder/Decoder online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/html-entity-encoder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTML Entity Encoder/Decoder Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free HTML Entity Encoder/Decoder online. Secure, local developer utility with no registration.",
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
