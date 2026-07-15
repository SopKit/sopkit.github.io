import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free Secure Password Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Secure Password Generator online. Fast, secure browser-based utility with no registration. Free & secure.",
	keywords: "secure password generator, free online tool, no signup, secure password generator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/secure-password-generator",
	},
	openGraph: {
		title: "Free Secure Password Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Secure Password Generator online. Fast, secure browser-based utility with no registration. Free & secure.",
		url: "https://sopkit.github.io/secure-password-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Secure Password Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Secure Password Generator online. Fast, secure browser-based utility with no registration. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/secure-password-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
