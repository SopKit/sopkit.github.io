import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Adsense Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Adsense Calculator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "adsense calculator, free online tool, no signup, adsense calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/adsense-calculator",
	},
	openGraph: {
		title: "Free Adsense Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Adsense Calculator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/adsense-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Adsense Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Adsense Calculator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/adsense-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="adsense-calculator" />
		</ToolLayout>
	);
}
