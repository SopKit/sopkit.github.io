import { SITE_URL } from "@/constants/config";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";


export const metadata = {
	title: "Free EMI Calculator India — No Signup | SopKit",
	description: "Enter your loan principal, interest rate and tenure to calculate the monthly EMI and see the total interest over the loan's life. Free, no signup.",
	keywords: "emi calculator, emi calculator for loans, loan emi calculator, monthly loan payment calculator, SopKit",
	alternates: {
		canonical: `${SITE_URL}/emi-calculator`,
	},
	openGraph: {
		title: "Free EMI Calculator India — No Signup | SopKit",
		description: "Enter your loan principal, interest rate and tenure to calculate the monthly EMI and see the total interest over the loan's life. Free, no signup.",
		url: `${SITE_URL}/emi-calculator`,
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free EMI Calculator India — No Signup | SopKit",
		description: "Enter your loan principal, interest rate and tenure to calculate the monthly EMI and see the total interest over the loan's life. Free, no signup.",
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
