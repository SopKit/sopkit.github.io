import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Compound Interest Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Compound Interest Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "compound interest calculator, future value calculator, investment growth calculator, savings interest calculator, compound interest formula",
	alternates: {
		canonical: "https://sopkit.github.io/compound-interest-calculator",
	},
	openGraph: {
		title: "Free Compound Interest Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Compound Interest Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/compound-interest-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Compound Interest Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Compound Interest Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/compound-interest-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="compound-interest-calculator" />
		</ToolLayout>
	);
}
