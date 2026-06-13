import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFRepair from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "PDF Repair Online Free - Edit, Merge & Convert PDF | SopKit",
	description: "Fix corrupted or broken PDF files online for free. Our secure repair tool rebuilds document headers and cross-reference tables to restore access to your PDF documents instantly. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-repair",
	},
	openGraph: {
		title: "PDF Repair Online Free - No Signup",
		description: "Fix corrupted or broken PDF files online for free. Our secure repair tool rebuilds document headers and cross-reference tables to restore access to your PDF doc",
		url: "https://sopkit.github.io/pdf-repair",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PDF Repair Online Free - Fast & Secure",
		description: "Fix corrupted or broken PDF files online for free. Our secure repair tool rebuilds document headers and cross-reference tables to restore access to your PDF doc",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-repair");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFRepair />
		</ToolLayout>
	);
}
