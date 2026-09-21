import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "URL Extractor",
  description: "Extract URLs from plain text, Markdown, logs, source snippets, and copied content. Normalize links, validate them, remove duplicates and optionally strip tracking parameters locally in your browser.",
  route: "/url-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/url-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
