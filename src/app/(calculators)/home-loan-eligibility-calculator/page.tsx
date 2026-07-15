import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Home Loan Eligibility Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Home Loan Eligibility Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "home loan eligibility calculator, home-loan-eligibility-calculator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/home-loan-eligibility-calculator",
	},
	openGraph: {
		title: "Free Home Loan Eligibility Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Home Loan Eligibility Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/home-loan-eligibility-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Home Loan Eligibility Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Home Loan Eligibility Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/home-loan-eligibility-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: tool.name,
						description: tool.description,
						url: "https://sopkit.github.io/home-loan-eligibility-calculator/",
						applicationCategory: "UtilitiesApplication",
						operatingSystem: "Any",
						offers: {
							"@type": "Offer",
							price: "0",
							priceCurrency: "USD"
						}
					})
				}}
			/>
			<ToolLayout breadcrumbs={[]} tool={tool} showHireMe={true}>
				<IntentToolDispatcher toolId={tool.id} />
			</ToolLayout>
		</>
	);
}
