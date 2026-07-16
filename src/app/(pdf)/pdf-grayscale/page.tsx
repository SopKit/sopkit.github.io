import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFGrayscale from "@/components/tools/pdf/PDFGrayscale";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "PDF Grayscale",
	description: "Private PDF Grayscale: privately convert PDF documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/pdf-grayscale",
	category: "pdf",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-grayscale");

	if (!tool) {
		return notFound();
	}

	const appSchema = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": "PDF Grayscale Converter",
		"url": "https://sopkit.github.io/pdf-grayscale/",
		"applicationCategory": "PDFApplication",
		"operatingSystem": "All",
		"browserRequirements": "Requires HTML5 support",
		"description": "Convert color PDF documents to black and white (grayscale) online for free. Reduce file size and save ink with this secure, browser-based PDF converter.",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		}
	};

	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "Why should I convert a PDF to grayscale?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Converting color PDFs to black-and-white (grayscale) is highly effective for reducing PDF file size and saving expensive ink when printing documents."
				}
			},
			{
				"@type": "Question",
				"name": "Is it safe to upload my PDF files to this converter?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Yes, it is 100% safe. Our tool uses WebAssembly and client-side JavaScript to process your PDF files locally on your device. Your sensitive document data never leaves your computer."
				}
			}
		]
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>
			<ToolLayout breadcrumbs={[]} tool={tool}>
				<PDFGrayscale />
			</ToolLayout>
		</>
	);
}
