import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import AllDownloaders from "@/components/tools/downloaders/AllDownloaders";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Downloaders Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Downloaders online. Fast, secure, and private processing with no signup. No registration needed.",
	keywords: "downloaders, free online tool, no signup, free downloaders, Downloaders online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/downloaders",
	},
	openGraph: {
		title: "Free Downloaders Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Downloaders online. Fast, secure, and private processing with no signup. No registration needed.",
		url: "https://sopkit.github.io/downloaders",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Downloaders Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Downloaders online. Fast, secure, and private processing with no signup. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/downloaders");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AllDownloaders />
		</ToolLayout>
	);
}
