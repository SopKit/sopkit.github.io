import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free ROI Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free ROI Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
	keywords: "roi calculator, return on investment calculator, annualized return calculator, investment return, profit percentage calculator",
	alternates: {
		canonical: "https://sopkit.github.io/roi-calculator",
	},
	openGraph: {
		title: "Free ROI Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free ROI Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
		url: "https://sopkit.github.io/roi-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free ROI Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free ROI Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/roi-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="roi-calculator" />
		</ToolLayout>
	);
}
