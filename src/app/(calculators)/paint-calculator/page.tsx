import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ConstructionCalculator from "@/components/tools/calculators/ConstructionCalculator";

export const metadata = {
	title: "Free Paint Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Paint Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
	keywords: "paint-calculator, Paint Calculator, how much paint do I need, wall paint calculator, paint room estimator, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/paint-calculator",
	},
	openGraph: {
		title: "Free Paint Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Paint Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
		url: "https://sopkit.github.io/paint-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Paint Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Paint Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/paint-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ConstructionCalculator defaultTab="paint" />
		</ToolLayout>
	);
}
