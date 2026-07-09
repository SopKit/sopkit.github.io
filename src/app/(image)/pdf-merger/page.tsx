import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Merger Online - Combine Multiple PDF Files | SopKit",
	description: "Combine multiple PDF documents into a single file quickly. Drag-and-drop to reorder pages or files, merge instantly, and download securely for free.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-merger/",
	},
	openGraph: {
		title: "Free PDF Merger Online - Combine Multiple PDF Files | SopKit",
		description: "Combine multiple PDF documents into a single file quickly. Drag-and-drop to reorder pages or files, merge instantly, and download securely for free.",
		url: "https://sopkit.github.io/pdf-merger/",
		siteName: "SopKit",
		images: [{ url: "/og-images/pdf-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Merger Online - Combine Multiple PDF Files | SopKit",
		description: "Combine multiple PDF documents into a single file quickly. Drag-and-drop to reorder pages or files, merge instantly, and download securely for free.",
		images: ["/og-images/pdf-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-merger");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
