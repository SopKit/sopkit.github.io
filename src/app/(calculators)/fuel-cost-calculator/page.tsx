import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Fuel Cost Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Fuel Cost Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
	keywords: "fuel cost calculator, trip fuel calculator, gas cost calculator, fuel consumption calculator, travel fuel cost",
	alternates: {
		canonical: "https://sopkit.github.io/fuel-cost-calculator",
	},
	openGraph: {
		title: "Free Fuel Cost Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Fuel Cost Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
		url: "https://sopkit.github.io/fuel-cost-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Fuel Cost Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Fuel Cost Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/fuel-cost-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="fuel-cost-calculator" />
		</ToolLayout>
	);
}
