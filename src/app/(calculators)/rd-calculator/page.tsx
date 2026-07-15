import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Recurring Deposit (RD) Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Recurring Deposit (RD) Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "recurring deposit (rd) calculator, free online tool, no signup, recurring deposit (rd) calculator online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/rd-calculator",
	},
	openGraph: {
		title: "Free Recurring Deposit (RD) Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Recurring Deposit (RD) Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/rd-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Recurring Deposit (RD) Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Recurring Deposit (RD) Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/rd-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
