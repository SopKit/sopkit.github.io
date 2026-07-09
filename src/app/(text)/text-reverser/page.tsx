import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Text Reverser Online Free | SopKit",
	description: "Flip your text backwards or reverse the order of words instantly for creative projects and coding. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/text-reverser/",
	},
	openGraph: {
		title: "Text Reverser Online Free - No Signup | SopKit",
		description: "Flip your text backwards or reverse the order of words instantly for creative projects and coding. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/text-reverser/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Text Reverser Online Free - Fast & Secure",
		description: "Flip your text backwards or reverse the order of words instantly for creative projects and coding. No signup, no uploads, 100% private browser-based tool.",
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
