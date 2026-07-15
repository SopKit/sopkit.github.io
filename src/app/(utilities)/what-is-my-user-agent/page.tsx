import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UserAgentTool from "@/components/tools/built-ins/UserAgentTool";

export const metadata = {
	title: "Free What Is My User Agent Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free What Is My User Agent online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "what is my user agent, free online tool, no signup, what is my user agent online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/what-is-my-user-agent",
	},
	openGraph: {
		title: "Free What Is My User Agent Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free What Is My User Agent online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/what-is-my-user-agent",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free What Is My User Agent Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free What Is My User Agent online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/what-is-my-user-agent");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UserAgentTool />
		</ToolLayout>
	);
}
