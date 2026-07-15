import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Average Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Average Calculator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "average calculator, free online tool, no signup, average calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/average-calculator",
	},
	openGraph: {
		title: "Free Average Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Average Calculator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/average-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Average Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Average Calculator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/average-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="average-calculator" />
		</ToolLayout>
	);
}
