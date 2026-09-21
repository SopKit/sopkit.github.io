import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "HTML Image Extractor",
  description: "Extract image URLs from HTML img tags, srcset, picture sources, Open Graph image tags, and Twitter image metadata for audits and research.",
  route: "/html-image-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/html-image-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
