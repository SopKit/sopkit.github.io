import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FinanceCalculators from "@/components/tools/impl/FinanceCalculators";


export const metadata = {
	title: "Free FD Calculator India Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free FD Calculator India online. Quick, accurate browser calculator with no registration. Easy to use.",
	keywords: "fd calculator india, free online tool, no signup, fd calculator india online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/fd-calculator-india",
	},
	openGraph: {
		title: "Free FD Calculator India Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free FD Calculator India online. Quick, accurate browser calculator with no registration. Easy to use.",
		url: "https://sopkit.github.io/fd-calculator-india",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free FD Calculator India Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free FD Calculator India online. Quick, accurate browser calculator with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/fd-calculator-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FinanceCalculators defaultTab="fd" />
		</ToolLayout>
	);
}
