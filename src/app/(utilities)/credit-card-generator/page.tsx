import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CreditCardGeneratorTool from "@/components/tools/security/CreditCardGeneratorTool";

export const metadata = {
	title: "Credit Card Generator Online Free - No Signup | SopKit",
	description: "Generate valid dummy credit card numbers for software testing and data validation. Our free online tool provides numbers that pass Luhn algorithm checks without being real cards. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/credit-card-generator/",
	},
	openGraph: {
		title: "Credit Card Generator Online Free - No Signup",
		description: "Generate valid dummy credit card numbers for software testing and data validation. Our free online tool provides numbers that pass Luhn algorithm checks without",
		url: "https://sopkit.github.io/credit-card-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Credit Card Generator Online Free - Fast & Secure",
		description: "Generate valid dummy credit card numbers for software testing and data validation. Our free online tool provides numbers that pass Luhn algorithm checks without",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/credit-card-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CreditCardGeneratorTool />
		</ToolLayout>
	);
}
