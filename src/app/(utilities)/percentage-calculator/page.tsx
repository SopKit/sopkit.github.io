import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Percentage Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Percentage Calculator online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "percentage calculator, free online tool, no signup, percentage calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/percentage-calculator",
	},
	openGraph: {
		title: "Free Percentage Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Percentage Calculator online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/percentage-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Percentage Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Percentage Calculator online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/percentage-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="percentage-calculator" />
		</ToolLayout>
	);
}
