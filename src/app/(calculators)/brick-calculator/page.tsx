import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ConstructionCalculator from "@/components/tools/calculators/ConstructionCalculator";

export const metadata = {
	title: "Free Brick Calculator Online - No Signup | SopKit",
	description: "Calculate the total number of bricks, cement bags, and sand volume required for building a wall.",
	keywords: "brick-calculator, Brick Calculator, bricks needed for wall, cement sand calculator, construction calculator, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/brick-calculator/",
	},
	openGraph: {
		title: "Free Brick Calculator Online - No Signup | SopKit",
		description: "Calculate the total number of bricks, cement bags, and sand volume required for building a wall.",
		url: "https://sopkit.github.io/brick-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Brick Calculator Online - No Signup | SopKit",
		description: "Calculate the total number of bricks, cement bags, and sand volume required for building a wall.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/brick-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ConstructionCalculator defaultTab="brick" />
		</ToolLayout>
	);
}
