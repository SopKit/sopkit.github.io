import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";


export const metadata = {
	title: "GST Calculator India Online Free | SopKit",
	description: "Calculate GST amount, inclusive/exclusive price, CGST, SGST, and IGST for Indian invoices instantly. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/gst-calculator-india/",
	},
	openGraph: {
		title: "GST Calculator India Online Free - No Signup | SopKit",
		description: "Calculate GST amount, inclusive/exclusive price, CGST, SGST, and IGST for Indian invoices instantly. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/gst-calculator-india/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "GST Calculator India Online Free - Fast & Secure",
		description: "Calculate GST amount, inclusive/exclusive price, CGST, SGST, and IGST for Indian invoices instantly. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/gst-calculator-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="gst-calculator" />
		</ToolLayout>
	);
}
