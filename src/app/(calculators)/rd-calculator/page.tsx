import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Recurring Deposit (RD) Calculator Online Free | SopKit",
	description: "Calculate the maturity amount and interest earned on your monthly Recurring Deposit (RD) investments. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/rd-calculator",
	},
	openGraph: {
		title: "Recurring Deposit (RD) Calculator Online Free - No Signup | SopKit",
		description: "Calculate the maturity amount and interest earned on your monthly Recurring Deposit (RD) investments. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/rd-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Recurring Deposit (RD) Calculator Online Free - Fast & Secure",
		description: "Calculate the maturity amount and interest earned on your monthly Recurring Deposit (RD) investments. No signup, no uploads, 100% private browser-based tool.",
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
