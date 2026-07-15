import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import InternetSpeedTestTool from "@/components/tools/utilities/InternetSpeedTestTool";

export const metadata = {
	title: "Free Internet Speed Test Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Internet Speed Test online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "internet speed test, free online tool, no signup, internet speed test online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/internet-speed-test",
	},
	openGraph: {
		title: "Free Internet Speed Test Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Internet Speed Test online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/internet-speed-test",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Internet Speed Test Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Internet Speed Test online. Fast, secure browser-based utility with no registration. 100% free and secure.",
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
