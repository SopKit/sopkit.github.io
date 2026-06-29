import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JobMessageGenerator from "@/components/tools/impl/JobMessageGenerator";


export const metadata = {
	title: "LinkedIn Headline Generator Online Free | SopKit",
	description: "Create professional LinkedIn headlines that stand out. Generate multiple variations for developers, students, freelancers, and marketers. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/linkedin-headline-generator/",
	},
	openGraph: {
		title: "LinkedIn Headline Generator Online Free - No Signup | SopKit",
		description: "Create professional LinkedIn headlines that stand out. Generate multiple variations for developers, students, freelancers, and marketers. No signup, no uploads,",
		url: "https://sopkit.github.io/linkedin-headline-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "LinkedIn Headline Generator Online Free - Fast & Secure",
		description: "Create professional LinkedIn headlines that stand out. Generate multiple variations for developers, students, freelancers, and marketers. No signup, no uploads,",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/linkedin-headline-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JobMessageGenerator defaultTab="linkedin-headline" />
		</ToolLayout>
	);
}
