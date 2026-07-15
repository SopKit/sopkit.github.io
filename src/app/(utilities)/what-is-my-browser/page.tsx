import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BrowserDetectTool from "@/components/tools/built-ins/BrowserDetectTool";

export const metadata = {
	title: "Free What Is My Browser Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free What Is My Browser online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "what is my browser, free online tool, no signup, what is my browser online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/what-is-my-browser",
	},
	openGraph: {
		title: "Free What Is My Browser Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free What Is My Browser online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/what-is-my-browser",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free What Is My Browser Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free What Is My Browser online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/what-is-my-browser");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BrowserDetectTool />
		</ToolLayout>
	);
}
