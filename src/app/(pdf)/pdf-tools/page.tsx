import ToolLayout from "@/components/tools/shared/ToolLayout";
import PDFPillar from "@/components/pillars/PDFPillar";
import { generateToolMetadata } from "@/lib/seo";
import CollectionPageJsonLd from "@/components/seo/CollectionPageJsonLd";
import CategoryToolGrid from "@/components/seo/CategoryToolGrid";

export const metadata = generateToolMetadata({
	name: "PDF Tools",
	description: "Private PDF Tools: privately compress PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training on your files. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/pdf-tools",
	category: "pdf",
});

export default async function ToolPage() {
	const tool = {
        "id": "pdf-tools",
        "name": "Professional PDF Suite",
        "description": "20+ enterprise-grade PDF utilities for merging, splitting, compressing, and converting documents with total privacy.",
        "route": "/pdf-tools",
        "category": "pdf",
        "article": `
## The Most Comprehensive Free PDF Suite Online
Stop paying for monthly subscriptions to simple PDF utilities. SopKit provides a professional-grade alternative to desktop software, allowing you to manipulate documents with surgical precision. 

### Privacy-First Browser Processing
We believe your documents belong to you. Our PDF suite is built using local-first technologies (PDF.js and PDF-Lib), meaning your files are never uploaded to a server. All merging, splitting, and conversion happens in your browser's secure sandbox.

### No Signup. No Limits. No Watermarks.
Unlike competitors who gate productivity behind paywalls and account creation, SopKit is committed to a frictionless experience. Download as many files as you need, whenever you need them.
        `
};

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CollectionPageJsonLd groupKey="pdf" name="Free Online PDF Tools Collection" description="A complete suite of free online PDF tools to merge, split, compress, and convert PDF files securely." />
			<PDFPillar />
			<CategoryToolGrid
				categorySlug="pdf"
				heading="All PDF tools"
				intro="Every PDF utility on SopKit: merge, split, compress, convert, protect, and unlock documents without uploading them."
			/>
		</ToolLayout>
	);
}
