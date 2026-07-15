import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Gratuity Calculator (India) Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Gratuity Calculator (India) online. Quick, accurate browser calculator with no registration.",
	keywords: "gratuity calculator (india), free online tool, no signup, gratuity calculator (india) online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/gratuity-calculator",
	},
	openGraph: {
		title: "Free Gratuity Calculator (India) Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Gratuity Calculator (India) online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/gratuity-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Gratuity Calculator (India) Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Gratuity Calculator (India) online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/gratuity-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
