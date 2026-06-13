import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Sales Tax Calculator Online Free - No Signup | SopKit",
	description: "Free sales tax calculator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/sales-tax-calculator",
	},
	openGraph: {
		title: "Sales Tax Calculator Online Free - No Signup",
		description: "Free sales tax calculator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		url: "https://sopkit.github.io/sales-tax-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Sales Tax Calculator Online Free - Fast & Secure",
		description: "Free sales tax calculator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
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
