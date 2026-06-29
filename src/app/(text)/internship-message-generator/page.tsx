import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JobMessageGenerator from "@/components/tools/impl/JobMessageGenerator";


export const metadata = {
	title: "Internship Application Message Generator Free | SopKit",
	description: "Generate short, human internship messages for LinkedIn, email, and founder outreach. Perfect for students and freshers. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/internship-message-generator/",
	},
	openGraph: {
		title: "Internship Application Message Generator Online Free - No Signup | SopKit",
		description: "Generate short, human internship messages for LinkedIn, email, and founder outreach. Perfect for students and freshers. No signup, no uploads, 100% private brow",
		url: "https://sopkit.github.io/internship-message-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Internship Application Message Generator Online Free - Fast & Secure",
		description: "Generate short, human internship messages for LinkedIn, email, and founder outreach. Perfect for students and freshers. No signup, no uploads, 100% private brow",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/internship-message-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JobMessageGenerator defaultTab="internship-message" />
		</ToolLayout>
	);
}
