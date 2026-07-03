import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Remove Duplicate Lines Online Free | SopKit",
	description: "Clean up your lists and data by automatically removing identical lines of text. Fast and private. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/remove-duplicate-lines",
	},
	openGraph: {
		title: "Remove Duplicate Lines Online Free - No Signup | SopKit",
		description: "Clean up your lists and data by automatically removing identical lines of text. Fast and private. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/remove-duplicate-lines",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Remove Duplicate Lines Online Free - Fast & Secure",
		description: "Clean up your lists and data by automatically removing identical lines of text. Fast and private. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/remove-duplicate-lines");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
