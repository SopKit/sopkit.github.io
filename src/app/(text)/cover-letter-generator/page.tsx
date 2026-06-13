import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JobMessageGenerator from "@/components/tools/impl/JobMessageGenerator";


export const metadata = {
	title: "Cover Letter Generator Online Free | SopKit",
	description: "Generate a personalized cover letter for internships, fresher jobs, remote jobs, and startup roles in seconds. Professional and ready to edit. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/cover-letter-generator",
	},
	openGraph: {
		title: "Cover Letter Generator Online Free - No Signup | SopKit",
		description: "Generate a personalized cover letter for internships, fresher jobs, remote jobs, and startup roles in seconds. Professional and ready to edit. No signup, no upl",
		url: "https://sopkit.github.io/cover-letter-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Cover Letter Generator Online Free - Fast & Secure",
		description: "Generate a personalized cover letter for internships, fresher jobs, remote jobs, and startup roles in seconds. Professional and ready to edit. No signup, no upl",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/cover-letter-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JobMessageGenerator defaultTab="cover-letter" />
		</ToolLayout>
	);
}
