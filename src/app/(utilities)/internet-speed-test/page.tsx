import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import InternetSpeedTestTool from "@/components/tools/utilities/InternetSpeedTestTool";

export const metadata = {
	title: "Internet Speed Test Online Free - No Signup | SopKit",
	description: "Check your internet connection speed online free. Measure your download speed, upload speed, and ping instantly. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/internet-speed-test",
	},
	openGraph: {
		title: "Internet Speed Test Online Free - No Signup",
		description: "Check your internet connection speed online free. Measure your download speed, upload speed, and ping instantly. No signup, no uploads, 100% private browser-bas",
		url: "https://sopkit.github.io/internet-speed-test",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Internet Speed Test Online Free - Fast & Secure",
		description: "Check your internet connection speed online free. Measure your download speed, upload speed, and ping instantly. No signup, no uploads, 100% private browser-bas",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/internet-speed-test");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InternetSpeedTestTool />
		</ToolLayout>
	);
}
