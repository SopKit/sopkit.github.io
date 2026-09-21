import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "Phone Number Extractor",
  description: "Extract phone-number-like sequences from notes, logs, contact lists, and copied text. Preserve source formatting while reporting digit counts and exporting results.",
  route: "/phone-number-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/phone-number-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
