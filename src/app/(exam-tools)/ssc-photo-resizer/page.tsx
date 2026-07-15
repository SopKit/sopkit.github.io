import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute, getToolById } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";

const relatedToolIds = [
  "signature-resizer-under-20kb",
  "upsc-photo-resizer",
  "railway-exam-photo-resizer",
  "pan-card-photo-resizer",
  "passport-photo-maker",
  "photo-compressor-under-50kb",
  "compress-image-to-20kb",
  "pdf-compressor-under-200kb",
  "jpg-to-pdf-exam-forms",
  "image-to-pdf",
];

export const metadata = {
	title: "Free SSC Photo Resizer Online - No Signup | SopKit",
	description: "Resize and compress files with our free SSC Photo Resizer online. Safe and private browser utility for government exam portal applications. No signup required.",
	keywords: "ssc photo resizer, free online tool, no signup, ssc photo resizer online, exam-tools, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ssc-photo-resizer",
	},
	openGraph: {
		title: "Free SSC Photo Resizer Online - No Signup | SopKit",
		description: "Resize and compress files with our free SSC Photo Resizer online. Safe and private browser utility for government exam portal applications. No signup required.",
		url: "https://sopkit.github.io/ssc-photo-resizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free SSC Photo Resizer Online - No Signup | SopKit",
		description: "Resize and compress files with our free SSC Photo Resizer online. Safe and private browser utility for government exam portal applications. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
  const tool = getToolByRoute("/ssc-photo-resizer");
  if (!tool) return notFound();

  const relatedTools = relatedToolIds
    .map(getToolById)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <ToolLayout breadcrumbs={[]} tool={tool} relatedTools={relatedTools}>
      <ExamPhotoResizer examName="SSC" />
    </ToolLayout>
  );
}
