import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PublicIpTool from "@/components/tools/built-ins/PublicIpTool";

export const metadata = {
	title: "Free What Is My IP Address Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free What Is My IP Address online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "what is my ip address, free online tool, no signup, what is my ip address online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/what-is-my-ip-address",
	},
	openGraph: {
		title: "Free What Is My IP Address Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free What Is My IP Address online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/what-is-my-ip-address",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free What Is My IP Address Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free What Is My IP Address online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/what-is-my-ip-address");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PublicIpTool />
		</ToolLayout>
	);
}
