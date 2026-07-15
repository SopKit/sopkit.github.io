import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Crontab Expression Generator Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free Crontab Expression Generator online. Secure, local developer utility with no registration.",
	keywords: "crontab expression generator, free online tool, no signup, crontab expression generator online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/crontab-generator",
	},
	openGraph: {
		title: "Free Crontab Expression Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Crontab Expression Generator online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/crontab-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Crontab Expression Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Crontab Expression Generator online. Secure, local developer utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/crontab-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
