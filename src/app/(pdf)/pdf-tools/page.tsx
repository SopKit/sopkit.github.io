import ToolLayout from "@/components/tools/shared/ToolLayout";
import PDFPillar from "@/components/pillars/PDFPillar";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "PDF Tools",
	description: "Private PDF Tools: privately compress PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
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
			<PDFPillar />
		</ToolLayout>
	);
}
