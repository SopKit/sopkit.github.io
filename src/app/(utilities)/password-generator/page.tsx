import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PasswordGeneratorTool from "@/components/tools/utilities/PasswordGeneratorTool";

export const metadata = {
	title: "Password Generator Online Free - No Signup | SopKit",
	description: "Create strong, secure passwords instantly with customizable settings. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/password-generator/",
	},
	openGraph: {
		title: "Password Generator Online Free - No Signup",
		description: "Create strong, secure passwords instantly with customizable settings. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/password-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Password Generator Online Free - Fast & Secure",
		description: "Create strong, secure passwords instantly with customizable settings. No signup, no uploads, 100% private browser-based tool.",
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
