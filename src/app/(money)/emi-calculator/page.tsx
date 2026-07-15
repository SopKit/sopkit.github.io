import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";


export const metadata = {
	title: "Free EMI Calculator for Loans Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free EMI Calculator for Loans online. Quick, accurate browser calculator with no registration.",
	keywords: "emi calculator for loans, free online tool, no signup, emi calculator for loans online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/emi-calculator",
	},
	openGraph: {
		title: "Free EMI Calculator for Loans Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free EMI Calculator for Loans online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/emi-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free EMI Calculator for Loans Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free EMI Calculator for Loans online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/emi-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="loan-calculator" />
		</ToolLayout>
	);
}
