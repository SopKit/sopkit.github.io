import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Tip Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Tip Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
	keywords: "tip calculator, gratuity calculator, bill split calculator, restaurant tip calculator, split the bill",
	alternates: {
		canonical: "https://sopkit.github.io/tip-calculator",
	},
	openGraph: {
		title: "Free Tip Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Tip Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
		url: "https://sopkit.github.io/tip-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Tip Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Tip Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/tip-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="tip-calculator" />
		</ToolLayout>
	);
}
