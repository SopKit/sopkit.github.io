import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Car Loan Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Car Loan Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
	keywords: "car loan calculator, auto loan calculator, car payment calculator, vehicle finance calculator, monthly car payment",
	alternates: {
		canonical: "https://sopkit.github.io/car-loan-calculator",
	},
	openGraph: {
		title: "Free Car Loan Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Car Loan Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
		url: "https://sopkit.github.io/car-loan-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Car Loan Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Car Loan Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/car-loan-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="car-loan-calculator" />
		</ToolLayout>
	);
}
