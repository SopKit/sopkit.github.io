import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ConstructionCalculator from "@/components/tools/calculators/ConstructionCalculator";

export const metadata = {
	title: "Free Tile Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Tile Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
	keywords: "tile-calculator, Tile Calculator, flooring tiles estimator, tiles needed for room, floor area calculator, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/tile-calculator",
	},
	openGraph: {
		title: "Free Tile Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Tile Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
		url: "https://sopkit.github.io/tile-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Tile Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Tile Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/tile-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ConstructionCalculator defaultTab="tile" />
		</ToolLayout>
	);
}
