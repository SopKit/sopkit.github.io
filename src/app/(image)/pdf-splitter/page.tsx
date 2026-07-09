import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Splitter Online - Extract PDF Pages | SopKit",
	description: "Split PDF files by specific page ranges or extract individual pages into standalone PDF files. Free browser utility with local files processing.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-splitter/",
	},
	openGraph: {
		title: "Free PDF Splitter Online - Extract PDF Pages | SopKit",
		description: "Split PDF files by specific page ranges or extract individual pages into standalone PDF files. Free browser utility with local files processing.",
		url: "https://sopkit.github.io/pdf-splitter/",
		siteName: "SopKit",
		images: [{ url: "/og-images/pdf-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Splitter Online - Extract PDF Pages | SopKit",
		description: "Split PDF files by specific page ranges or extract individual pages into standalone PDF files. Free browser utility with local files processing.",
		images: ["/og-images/pdf-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-splitter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
