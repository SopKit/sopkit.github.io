import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SimpleInvoiceGenerator from "@/components/tools/generators/InvoiceGenerator";


export const metadata = {
	title: "Invoice Generator India with GST Online Free | SopKit",
	description: "Create professional invoices for Indian freelancers and businesses with GST, discounts, and PDF download for free. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/invoice-generator-india",
	},
	openGraph: {
		title: "Invoice Generator India with GST Online Free - No Signup | SopKit",
		description: "Create professional invoices for Indian freelancers and businesses with GST, discounts, and PDF download for free. No signup, no uploads, 100% private browser-b",
		url: "https://sopkit.github.io/invoice-generator-india",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Invoice Generator India with GST Online Free - Fast & Secure",
		description: "Create professional invoices for Indian freelancers and businesses with GST, discounts, and PDF download for free. No signup, no uploads, 100% private browser-b",
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
