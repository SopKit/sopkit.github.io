import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Savings Goal Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Savings Goal Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "savings goal calculator, monthly savings calculator, savings target planner, how much to save calculator, savings plan calculator",
	alternates: {
		canonical: "https://sopkit.github.io/savings-goal-calculator",
	},
	openGraph: {
		title: "Free Savings Goal Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Savings Goal Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/savings-goal-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Savings Goal Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Savings Goal Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/savings-goal-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="savings-goal-calculator" />
		</ToolLayout>
	);
}
