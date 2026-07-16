import type { Metadata } from "next";
import HubPage from "@/components/seo/HubPage";

export const metadata: Metadata = {
	title: "Free Online Calculators - Math, Finance, Academic & Student Tools | SopKit",
	description: "Free online calculators for math, GPA, attendance, loan estimations, and business markup. Get instant calculations without signing up.",
	alternates: { canonical: "https://sopkit.github.io/calculator-tools/" },
};

export default function CalculatorToolsHub() {
	return (
		<HubPage
			title="Calculator Tools"
			description="Explore our collection of free online calculators. Get instant results for loan EMIs, GST, academic grades, attendance, and business margins."
			route="/calculator-tools"
		tools={getAllTools().filter(t => ["bmi-calculator","gpa-to-4-scale-converter","cgpa-to-percentage-calculator","gst-calculator","emi-calculator","sip-calculator","salary-calculator-india","freelance-rate-calculator"].includes(t.id))}
			mainCategorySlugs={["calculators"]}
			guideTitle="Using SopKit Calculators"
			guidePoints={[
				"Use academic calculators to plan semester grades and check required marks for exams.",
				"Estimate business markups and sales taxes to plan client proposals and product prices.",
				"Check attendance margins to ensure you meet the required minimum college attendance percentage.",
			]}
			faqs={[
				{ question: "How do I choose the right calculator?", answer: "Browse the calculators on this page or search for specific terms like attendance, loan, or SGPA in our search bar." },
				{ question: "Are my calculations private?", answer: "Yes, all inputs and results are processed client-side. We do not store or track any numbers you enter." },
				{ question: "Can I request a new calculator?", answer: "Yes! If you need a specific calculator for your business, studies, or daily tasks, contact us using the link in the footer." },
			]}
		/>
	);
}
