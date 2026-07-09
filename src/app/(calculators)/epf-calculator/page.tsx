import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "EPF Calculator (Employee Provident Fund) Free | SopKit",
	description: "Calculate your EPF maturity amount based on your basic salary, monthly contribution, and current interest rate. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/epf-calculator",
	},
	openGraph: {
		title: "EPF Calculator (Employee Provident Fund) Online Free - No Signup | SopKit",
		description: "Calculate your EPF maturity amount based on your basic salary, monthly contribution, and current interest rate. No signup, no uploads, 100% private browser-base",
		url: "https://sopkit.github.io/epf-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "EPF Calculator (Employee Provident Fund) Online Free - Fast & Secure",
		description: "Calculate your EPF maturity amount based on your basic salary, monthly contribution, and current interest rate. No signup, no uploads, 100% private browser-base",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/epf-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
