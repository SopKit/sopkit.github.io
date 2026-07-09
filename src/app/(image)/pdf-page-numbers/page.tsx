import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Add Page Numbers to PDF Online Free - PDF Pagination | SopKit",
	description: "Add page numbers to your PDF documents online. Customize layout positions (headers/footers), alignments, font sizes, and start index numbers securely.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-page-numbers/",
	},
	openGraph: {
		title: "Add Page Numbers to PDF Online Free - PDF Pagination | SopKit",
		description: "Add page numbers to your PDF documents online. Customize layout positions (headers/footers), alignments, font sizes, and start index numbers securely.",
		url: "https://sopkit.github.io/pdf-page-numbers/",
		siteName: "SopKit",
		images: [{ url: "/og-images/pdf-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Add Page Numbers to PDF Online Free - PDF Pagination | SopKit",
		description: "Add page numbers to your PDF documents online. Customize layout positions (headers/footers), alignments, font sizes, and start index numbers securely.",
		images: ["/og-images/pdf-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-page-numbers");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
