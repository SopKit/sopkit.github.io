import { SITE_URL } from "@/constants/config";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";


export const metadata = {
	title: "Free GST Calculator India — No Signup | SopKit",
	description: "Enter the exclusive base amount and GST rate to get a full GST breakdown: tax amount and total including GST. Free GST calculator for India, no signup.",
	keywords: "gst calculator india, gst calculator, gst rate calculator, gst inclusive exclusive calculator, SopKit",
	alternates: {
		canonical: `${SITE_URL}/gst-calculator-india`,
	},
	openGraph: {
		title: "Free GST Calculator India — No Signup | SopKit",
		description: "Enter the exclusive base amount and GST rate to get a full GST breakdown: tax amount and total including GST. Free GST calculator for India, no signup.",
		url: `${SITE_URL}/gst-calculator-india`,
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free GST Calculator India — No Signup | SopKit",
		description: "Enter the exclusive base amount and GST rate to get a full GST breakdown: tax amount and total including GST. Free GST calculator for India, no signup.",
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
