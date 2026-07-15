import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramStoryDownloader from "@/components/tools/downloaders/InstagramStoryDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Instagram Highlights Saver Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Instagram Highlights Saver online. Fast, secure, and private processing with no signup.",
	keywords: "ig highlights saver, free online tool, no signup, ig-highlights-saver, free ig-highlights-saver, Ig Highlights Saver online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ig-highlights-saver",
	},
	openGraph: {
		title: "Free Instagram Highlights Saver Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Highlights Saver online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/ig-highlights-saver",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Instagram Highlights Saver Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Highlights Saver online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ig-highlights-saver");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramStoryDownloader />
		</ToolLayout>
	);
}
