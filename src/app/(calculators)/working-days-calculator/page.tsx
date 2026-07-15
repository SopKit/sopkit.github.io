import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Working Days Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Working Days Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "working days calculator, free online tool, no signup, working days calculator online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/working-days-calculator",
	},
	openGraph: {
		title: "Free Working Days Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Working Days Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/working-days-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Working Days Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Working Days Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/working-days-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
