import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PublicIpTool from "@/components/tools/built-ins/PublicIpTool";

export const metadata = {
	title: "What Is My IP Address Online Free - No Signup | SopKit",
	description: "Free what is my ip address tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/what-is-my-ip-address",
	},
	openGraph: {
		title: "What Is My IP Address Online Free - No Signup",
		description: "Free what is my ip address tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based ",
		url: "https://sopkit.github.io/what-is-my-ip-address",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "What Is My IP Address Online Free - Fast & Secure",
		description: "Free what is my ip address tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based ",
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
		<ToolLayout tool={tool}>
			<PublicIpTool />
		</ToolLayout>
	);
}
