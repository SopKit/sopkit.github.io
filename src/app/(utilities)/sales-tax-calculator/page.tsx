import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Sales Tax Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Sales Tax Calculator online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "sales tax calculator, free online tool, no signup, sales tax calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/sales-tax-calculator",
	},
	openGraph: {
		title: "Free Sales Tax Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Sales Tax Calculator online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/sales-tax-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Sales Tax Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Sales Tax Calculator online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/sales-tax-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="sales-tax-calculator" />
		</ToolLayout>
	);
}
