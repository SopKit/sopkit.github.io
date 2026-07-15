import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Break-Even Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Break-Even Calculator online. Quick, accurate browser calculator with no registration. 100% free.",
	keywords: "break even calculator, break even point, break even analysis, break even units, cost volume profit calculator",
	alternates: {
		canonical: "https://sopkit.github.io/break-even-calculator",
	},
	openGraph: {
		title: "Free Break-Even Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Break-Even Calculator online. Quick, accurate browser calculator with no registration. 100% free.",
		url: "https://sopkit.github.io/break-even-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Break-Even Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Break-Even Calculator online. Quick, accurate browser calculator with no registration. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/break-even-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="break-even-calculator" />
		</ToolLayout>
	);
}
