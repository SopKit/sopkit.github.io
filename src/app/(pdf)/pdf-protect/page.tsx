import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import PDFProtect from "@/components/tools/pdf/PDFProtect";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "PDF Password Protect",
	description: "Private PDF Password Protect: privately process PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/pdf-protect",
	category: "pdf",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-protect");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFProtect />
		</ToolLayout>
	);
}
