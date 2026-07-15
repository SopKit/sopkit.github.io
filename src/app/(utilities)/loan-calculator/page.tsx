import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Loan Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Loan Calculator online. Fast, secure browser-based utility with no registration. No registration needed.",
	keywords: "loan calculator, free online tool, no signup, loan calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/loan-calculator",
	},
	openGraph: {
		title: "Free Loan Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Loan Calculator online. Fast, secure browser-based utility with no registration. No registration needed.",
		url: "https://sopkit.github.io/loan-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Loan Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Loan Calculator online. Fast, secure browser-based utility with no registration. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/loan-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="loan-calculator" />
		</ToolLayout>
	);
}
