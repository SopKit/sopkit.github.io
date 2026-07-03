import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Case Converter (Sentence, Upper, Lower) Online Free | SopKit",
	description: "Change the case of your text to UPPERCASE, lowercase, Sentence case, or Title Case instantly. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/case-converter",
	},
	openGraph: {
		title: "Case Converter (Sentence, Upper, Lower) Online Free - No Signup | SopKit",
		description: "Change the case of your text to UPPERCASE, lowercase, Sentence case, or Title Case instantly. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/case-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Case Converter (Sentence, Upper, Lower) Online Free - Fast & Secure",
		description: "Change the case of your text to UPPERCASE, lowercase, Sentence case, or Title Case instantly. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/case-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
