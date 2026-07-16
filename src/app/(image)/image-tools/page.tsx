import ToolLayout from "@/components/tools/shared/ToolLayout";
import ImagePillar from "@/components/pillars/ImagePillar";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Free Image Tools Online",
	description: "Private Free Image Tools: privately process images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/image-tools",
	category: "image",
});

export default async function ToolPage() {
	const tool = {
        "id": "image-tools",
        "name": "Professional Image Suite",
        "description": "Powerful AI-driven and browser-based image utilities for creators, developers, and social media managers.",
        "route": "/image-tools",
        "category": "image",
        "article": `
## Professional Photo Editing and Optimization Online
SopKit brings the power of desktop photo editors directly to your browser. Our Image Suite is optimized for speed, precision, and privacy, making it the perfect choice for professional workflows.

### AI Subject Isolation & Background Removal
Leverage cutting-edge machine learning models to remove backgrounds from your photos instantly. Perfect for e-commerce product listings and professional profile pictures.

### Advanced Format Compression
Save up to 80% on file size without visible quality loss. Our compressor uses state-of-the-art algorithms to ensure your website assets are as light as possible for perfect Core Web Vitals.

### 100% Secure & Private
Unlike other online editors, we process your images on your own hardware. Your private photos are never uploaded to our servers, giving you total peace of mind for sensitive projects.
        `
};

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImagePillar />
		</ToolLayout>
	);
}
