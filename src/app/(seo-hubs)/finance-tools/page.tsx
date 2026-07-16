import type { Metadata } from "next";
import HubPage from "@/components/seo/HubPage";

export const metadata: Metadata = {
	title: "Finance Calculators - Loan, GST, Margin & Sales Tax Tools | SopKit",
	description: "Free online finance calculators. Estimate loan EMIs, add or remove GST, check profit margins, calculate sales tax, and check PayPal fees instantly.",
	alternates: { canonical: "https://sopkit.github.io/finance-tools/" },
};

export default function FinanceToolsHub() {
	return (
		<HubPage
			title="Finance Tools"
			description="Estimate loans, calculate sales taxes, find profit margins, and calculate payment fees. Fast, accurate, and secure browser-based calculations."
			route="/finance-tools"
		tools={getAllTools().filter(t => ["gst-calculator","emi-calculator","sip-calculator","salary-calculator-india","income-tax-calculator","fd-calculator-india","profit-margin-calculator","roi-calculator"].includes(t.id))}
			mainCategorySlugs={["calculators"]}
			guideTitle="Financial Planning Advice"
			guidePoints={[
				"Use loan calculators to check monthly EMI options and total interest payments over the tenure.",
				"Estimate profit margins, markup factors, and markup percentages before pricing your products.",
				"All calculations run locally. No financial parameters, revenue figures, or data points are sent to servers.",
			]}
			faqs={[
				{ question: "Are the financial results official?", answer: "No, treat all results as estimates. Always verify critical financial figures with your bank or accountant." },
				{ question: "Does the GST calculator support custom rates?", answer: "Yes, you can choose pre-configured GST rates (5%, 12%, 18%, 28%) or input custom tax percentages." },
				{ question: "Is this finance suite safe to use?", answer: "Absolutely. SopKit calculations are done client-side, making it highly secure for private business calculations." },
			]}
		/>
	);
}
