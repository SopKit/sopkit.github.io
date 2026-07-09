import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Confidence Interval Calculator Online Free - No Signup | SopKit",
	description: "Calculate the confidence interval for your statistical data instantly. Our free online tool helps you understand data precision and margin of error in your research. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/confidence-interval-calculator/",
	},
	openGraph: {
		title: "Confidence Interval Calculator Online Free - No Signup",
		description: "Calculate the confidence interval for your statistical data instantly. Our free online tool helps you understand data precision and margin of error in your rese",
		url: "https://sopkit.github.io/confidence-interval-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Confidence Interval Calculator Online Free - Fast & Secure",
		description: "Calculate the confidence interval for your statistical data instantly. Our free online tool helps you understand data precision and margin of error in your rese",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/confidence-interval-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="confidence-interval-calculator" />
		</ToolLayout>
	);
}
