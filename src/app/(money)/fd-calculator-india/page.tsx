import { SITE_URL } from "@/constants/config";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FinanceCalculators from "@/components/tools/impl/FinanceCalculators";


export const metadata = {
	title: "Free FD Calculator India Online - No Signup | SopKit",
	description: "Enter your fixed deposit amount, interest rate and tenure to see the maturity value and interest earned with quarterly compounding. Free FD calculator, no signup.",
	keywords: "fd calculator india, fixed deposit calculator, fd maturity calculator, fd interest calculator, SopKit",
	alternates: {
		canonical: `${SITE_URL}/fd-calculator-india`,
	},
	openGraph: {
		title: "Free FD Calculator India Online - No Signup | SopKit",
		description: "Enter your fixed deposit amount, interest rate and tenure to see the maturity value and interest earned with quarterly compounding. Free FD calculator, no signup.",
		url: `${SITE_URL}/fd-calculator-india`,
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free FD Calculator India Online - No Signup | SopKit",
		description: "Enter your fixed deposit amount, interest rate and tenure to see the maturity value and interest earned with quarterly compounding. Free FD calculator, no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/fd-calculator-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FinanceCalculators defaultTab="fd" />
		</ToolLayout>
	);
}
