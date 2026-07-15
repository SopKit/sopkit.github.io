import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free BMI Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free BMI Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
	keywords: "bmi calculator, body mass index calculator, bmi chart, healthy weight calculator, calculate bmi",
	alternates: {
		canonical: "https://sopkit.github.io/bmi-calculator",
	},
	openGraph: {
		title: "Free BMI Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free BMI Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
		url: "https://sopkit.github.io/bmi-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free BMI Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free BMI Calculator online. Quick, accurate browser calculator with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/bmi-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="bmi-calculator" />
		</ToolLayout>
	);
}
