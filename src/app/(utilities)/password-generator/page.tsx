import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PasswordGeneratorTool from "@/components/tools/utilities/PasswordGeneratorTool";

export const metadata = {
	title: "Free Password Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Password Generator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "password generator, free online tool, no signup, password generator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/password-generator",
	},
	openGraph: {
		title: "Free Password Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Password Generator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/password-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Password Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Password Generator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/password-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PasswordGeneratorTool />
		</ToolLayout>
	);
}
