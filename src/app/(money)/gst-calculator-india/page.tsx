import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";


export const metadata = {
	title: "Free GST Calculator India Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free GST Calculator India online. Quick, accurate browser calculator with no registration. Easy to use.",
	keywords: "gst calculator india, free online tool, no signup, gst calculator india online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/gst-calculator-india",
	},
	openGraph: {
		title: "Free GST Calculator India Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free GST Calculator India online. Quick, accurate browser calculator with no registration. Easy to use.",
		url: "https://sopkit.github.io/gst-calculator-india",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free GST Calculator India Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free GST Calculator India online. Quick, accurate browser calculator with no registration. Easy to use.",
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
