import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TelegramDownloader from "@/components/tools/downloaders/TelegramDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Telegram Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Telegram Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "telegram video downloader, free online tool, no signup, telegram-video-downloader, free telegram-video-downloader, Telegram Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/telegram-video-downloader",
	},
	openGraph: {
		title: "Free Telegram Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Telegram Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/telegram-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Telegram Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Telegram Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/telegram-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TelegramDownloader />
		</ToolLayout>
	);
}
