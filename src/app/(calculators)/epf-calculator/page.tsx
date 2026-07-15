import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free EPF Calculator (Employee Provident Fund) Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free EPF Calculator (Employee Provident Fund) online. Quick, accurate browser calculator with no reg...",
	keywords: "epf calculator (employee provident fund), free online tool, no signup, epf calculator (employee provident fund) online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/epf-calculator",
	},
	openGraph: {
		title: "Free EPF Calculator (Employee Provident Fund) Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free EPF Calculator (Employee Provident Fund) online. Quick, accurate browser calculator with no reg...",
		url: "https://sopkit.github.io/epf-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free EPF Calculator (Employee Provident Fund) Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free EPF Calculator (Employee Provident Fund) online. Quick, accurate browser calculator with no reg...",
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
