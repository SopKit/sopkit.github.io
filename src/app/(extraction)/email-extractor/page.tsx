import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "Email Extractor",
  description: "Extract email addresses from pasted text, contact lists, HTML, Markdown, and documents. Normalize, deduplicate, group by domain, and export clean results locally.",
  route: "/email-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/email-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
