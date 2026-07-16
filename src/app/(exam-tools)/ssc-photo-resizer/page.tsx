import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute, getToolById } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";
import { generateToolMetadata } from "@/lib/seo";

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

export const metadata = generateToolMetadata({
	name: "SSC Photo Resizer",
	description: "Private SSC Photo Resizer: privately compress exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/ssc-photo-resizer",
	category: "exam-tools",
});

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
