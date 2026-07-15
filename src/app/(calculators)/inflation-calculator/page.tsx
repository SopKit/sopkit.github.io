import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Inflation Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Inflation Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
	keywords: "inflation calculator, buying power calculator, future value of money, purchasing power calculator, inflation impact",
	alternates: {
		canonical: "https://sopkit.github.io/inflation-calculator",
	},
	openGraph: {
		title: "Free Inflation Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Inflation Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
		url: "https://sopkit.github.io/inflation-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Inflation Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Inflation Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/inflation-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="inflation-calculator" />
		</ToolLayout>
	);
}
