import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UuidGenerator from "@/components/tools/built-ins/UuidGeneratorTool";

export const metadata = {
	title: "Free Random UUID Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Random UUID Generator online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "random uuid generator, free online tool, no signup, random uuid generator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/random-uuid-generator",
	},
	openGraph: {
		title: "Free Random UUID Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Random UUID Generator online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/random-uuid-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Random UUID Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Random UUID Generator online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/random-uuid-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UuidGenerator />
		</ToolLayout>
	);
}
