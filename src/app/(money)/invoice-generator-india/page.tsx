import { SITE_URL } from "@/constants/config";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SimpleInvoiceGenerator from "@/components/tools/generators/InvoiceGenerator";


export const metadata = {
	title: "Free GST Invoice Generator India — No Signup | SopKit",
	description: "Build a GST-ready invoice with line items, quantities, rates and per-item tax, plus your business details and GSTIN. Print or save it as a PDF. Free, no signup.",
	keywords: "invoice generator india with gst, gst invoice maker, free invoice generator, gst billing, SopKit",
	alternates: {
		canonical: `${SITE_URL}/invoice-generator-india`,
	},
	openGraph: {
		title: "Free GST Invoice Generator India — No Signup | SopKit",
		description: "Build a GST-ready invoice with line items, quantities, rates and per-item tax, plus your business details and GSTIN. Print or save it as a PDF. Free, no signup.",
		url: `${SITE_URL}/invoice-generator-india`,
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free GST Invoice Generator India — No Signup | SopKit",
		description: "Build a GST-ready invoice with line items, quantities, rates and per-item tax, plus your business details and GSTIN. Print or save it as a PDF. Free, no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/invoice-generator-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SimpleInvoiceGenerator />
		</ToolLayout>
	);
}
