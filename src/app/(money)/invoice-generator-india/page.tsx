import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SimpleInvoiceGenerator from "@/components/tools/generators/InvoiceGenerator";


export const metadata = {
	title: "Free Invoice Generator India with GST Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Invoice Generator India with GST online. Quick, accurate browser calculator with no registration.",
	keywords: "invoice generator india with gst, free online tool, no signup, invoice generator india with gst online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/invoice-generator-india",
	},
	openGraph: {
		title: "Free Invoice Generator India with GST Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Invoice Generator India with GST online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/invoice-generator-india",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Invoice Generator India with GST Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Invoice Generator India with GST online. Quick, accurate browser calculator with no registration.",
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
