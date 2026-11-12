import { buildCanonicalUrl } from "@/seo/canonical";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import ExamPillar from "@/components/pillars/ExamPillar";
import CollectionPageJsonLd from "@/components/seo/CollectionPageJsonLd";
import CategoryToolGrid from "@/components/seo/CategoryToolGrid";

export const metadata = {
	title: "Free Exam Image & Form Tools Online - No Signup | SopKit",
	description: "Prepare photos, signatures, and PDFs for online UPSC, SSC, NEET, and JEE forms. Crop, resize, and compress to exact KB limits securely in your browser.",
	alternates: {
		canonical: buildCanonicalUrl("/exam-tools"),
	},
	openGraph: {
		title: "Free Exam Image & Form Tools Online - No Signup | SopKit",
		description: "Prepare photos, signatures, and PDFs for online UPSC, SSC, NEET, and JEE forms. Crop, resize, and compress to exact KB limits securely in your browser.",
		url: buildCanonicalUrl("/exam-tools"),
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Free Exam Image & Form Tools Online - No Signup | SopKit",
		description: "Prepare photos, signatures, and PDFs for online UPSC, SSC, NEET, and JEE forms. Crop, resize, and compress to exact KB limits securely in your browser.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = {
		id: "exam-tools",
		name: "Exam Image & Form Tools",
		description: "Resize and compress photos, signatures, and PDF certificates to the exact dimensions and size requirements specified in official exam notifications.",
		route: "/exam-tools",
		category: "exam-tools",
		article: `
## Official Exam Document Preparation Online
Preparing files for government and university entrance exam forms can be difficult due to strict size requirements. SopKit provides direct browser-based utilities to crop, resize, and compress your uploads to standard formats.

### NTA JEE & NEET Photo Preparation
Quickly crop your passport photo to NTA specifications (10KB to 200KB) and signatures (4KB to 30KB). You can also resize the NEET postcard photo (4x6 inches) with correct margins.

### UPSC & SSC Form Resizers
Apply the required UPSC IAS/IFS square dimensions (350x350 pixels) or the standard SSC 3.5cm x 4.5cm dimensions to your photo and signature with correct KB weight targets.

### 100% Client-Side Processing
We respect your privacy. No personal files are uploaded to our servers. All document cropping, resizing, and compression are processed locally inside your browser window.
		`
	};

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CollectionPageJsonLd groupKey="exam-tools" name="Exam Image & Form Tools" description="Free browser-based tools to crop, resize, and compress photos, signatures, and PDFs to official exam form limits." />
			<ExamPillar />
			<CategoryToolGrid
				categorySlug="exam-tools"
				heading="All exam tools"
				intro="Every exam-form utility on SopKit: photo and signature resizers, KB-target compressors, and PDF preparers for UPSC, SSC, NEET, JEE, and more."
			/>
		</ToolLayout>
	);
}
