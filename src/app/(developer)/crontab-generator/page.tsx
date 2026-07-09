import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Crontab Expression Generator Online Free | SopKit",
	description: "Easily create and validate cron job expressions with our interactive visual generator. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/crontab-generator/",
	},
	openGraph: {
		title: "Crontab Expression Generator Online Free - No Signup | SopKit",
		description: "Easily create and validate cron job expressions with our interactive visual generator. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/crontab-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Crontab Expression Generator Online Free - Fast & Secure",
		description: "Easily create and validate cron job expressions with our interactive visual generator. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/crontab-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
