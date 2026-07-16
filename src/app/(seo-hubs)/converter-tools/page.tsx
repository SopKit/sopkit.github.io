import type { Metadata } from "next";
import HubPage from "@/components/seo/HubPage";
import { getAllTools } from "@/lib/tools";

export const metadata: Metadata = {
	title: "Free Online Converter Tools - Image, PDF & Code Converters | SopKit",
	description: "Free online format converter tools. Convert images to PDF, Word documents to PDF, text to binary, and format files locally and securely.",
	alternates: { canonical: "https://sopkit.github.io/converter-tools/" },
};

export default function ConverterToolsHub() {
	return (
		<HubPage
			title="Converter Tools"
			description="Convert files, images, documents, and data formats instantly in your browser. Fast, free, and completely secure client-side conversions."
			route="/converter-tools"
		tools={getAllTools().filter(t => ["jpg-to-png-converter","png-to-jpg-converter","webp-to-png-converter","png-to-webp-converter","svg-to-png","ico-to-png","base64-encode","base64-decode","url-encode","url-decode"].includes(t.id))}			guideTitle="File and Format Conversion Best Practices"
			guidePoints={[
				"Use image converters to convert PNG and WebP files to JPG to meet application upload limits.",
				"Convert Word documents and images to PDF format to preserve formatting when sharing files.",
				"Choose WebP output for website photos to optimize image loading times and improve site SEO performance.",
			]}
			faqs={[
				{ question: "Is there a file size limit?", answer: "SopKit processes files locally on your device, so limits depend on your computer or phone browser's memory." },
				{ question: "Are my original files stored?", answer: "No, files are processed inside your browser sandbox and are never uploaded to a server." },
				{ question: "Can I convert multiple files in batch?", answer: "Yes, our converters support selecting and converting multiple files simultaneously." },
			]}
		/>
	);
}
