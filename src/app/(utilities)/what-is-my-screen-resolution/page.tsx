import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ScreenResolutionTool from "@/components/tools/built-ins/ScreenResolutionTool";

export const metadata = {
	title: "Free What Is My Screen Resolution Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free What Is My Screen Resolution online. Fast, secure browser-based utility with no registration. Easy to use.",
	keywords: "what is my screen resolution, free online tool, no signup, what is my screen resolution online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/what-is-my-screen-resolution",
	},
	openGraph: {
		title: "Free What Is My Screen Resolution Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free What Is My Screen Resolution online. Fast, secure browser-based utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/what-is-my-screen-resolution",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free What Is My Screen Resolution Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free What Is My Screen Resolution online. Fast, secure browser-based utility with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/what-is-my-screen-resolution");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ScreenResolutionTool />
		</ToolLayout>
	);
}
