import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Confidence Interval Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Confidence Interval Calculator online. Fast, secure browser-based utility with no registration. 100% free.",
	keywords: "confidence interval calculator, free online tool, no signup, confidence interval calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/confidence-interval-calculator",
	},
	openGraph: {
		title: "Free Confidence Interval Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Confidence Interval Calculator online. Fast, secure browser-based utility with no registration. 100% free.",
		url: "https://sopkit.github.io/confidence-interval-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Confidence Interval Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Confidence Interval Calculator online. Fast, secure browser-based utility with no registration. 100% free.",
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
