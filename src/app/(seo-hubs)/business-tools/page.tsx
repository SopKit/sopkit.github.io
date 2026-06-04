import type { Metadata } from "next";
import SeoHubPage from "@/components/seo/SeoHubPage";

export const metadata: Metadata = {
	title: "Business Tools - Free Online Utilities for Startups & Shops | SopKit",
	description: "Free online business tools including invoice generators, rent receipt creators, leave applications, and GST calculators. Boost your business efficiency.",
	alternates: { canonical: "https://sopkit.github.io/business-tools" },
};

export default function BusinessToolsHub() {
	return (
		<SeoHubPage
			title="Business Tools"
			description="Low-friction tools for business owners, freelancers, and startups. Generate invoices, print HRA rent receipts, draft HR letters, and estimate taxes easily."
			route="/business-tools"
			mainCategorySlugs={["generators"]}
			guideTitle="Business Tool Workflows"
			guidePoints={[
				"Use invoice and receipt generators to prepare client bills and claim tax deductions.",
				"Draft professional HR communications, including leave applications and resignation letters.",
				"All tools run entirely in the browser, ensuring your business data and client details remain completely private.",
			]}
			faqs={[
				{ question: "Is my client or business data saved?", answer: "No, all receipts, invoices, and documents are generated locally in your browser. We never store or upload your data." },
				{ question: "Are these tools free for commercial use?", answer: "Yes, you can use all generated invoices, receipts, and templates for your business or freelance projects for free." },
				{ question: "Can I download receipts as PDF?", answer: "Yes, click print or download to save receipts and invoices as high-quality PDF files." },
			]}
		/>
	);
}
