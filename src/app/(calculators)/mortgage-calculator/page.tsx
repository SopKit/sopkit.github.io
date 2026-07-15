import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Mortgage Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Mortgage Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
	keywords: "mortgage calculator, monthly mortgage payment, home loan calculator, mortgage interest calculator, house payment calculator",
	alternates: {
		canonical: "https://sopkit.github.io/mortgage-calculator",
	},
	openGraph: {
		title: "Free Mortgage Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Mortgage Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
		url: "https://sopkit.github.io/mortgage-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Mortgage Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Mortgage Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/mortgage-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="mortgage-calculator" />
		</ToolLayout>
	);
}
