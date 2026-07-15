import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Probability Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Probability Calculator online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "probability calculator, free online tool, no signup, probability calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/probability-calculator",
	},
	openGraph: {
		title: "Free Probability Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Probability Calculator online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/probability-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Probability Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Probability Calculator online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/probability-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="probability-calculator" />
		</ToolLayout>
	);
}
