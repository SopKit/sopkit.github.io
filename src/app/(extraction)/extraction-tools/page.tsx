import Link from "next/link";
import { ArrowRight, Braces, FileCode2, Globe2, Link2, Mail, Regex, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllToolsByCategory } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "Extraction Tools",
  description: "Extract URLs, emails, domains, IP addresses, HTML links, images, metadata, JSON values, regex matches, and CSV columns locally.",
  route: "/extraction-tools",
  category: "extraction",
});

const iconFor=(id:string)=>{if(id.includes("json"))return Braces;if(id.includes("html"))return FileCode2;if(id.includes("url")||id.includes("link"))return Link2;if(id.includes("email"))return Mail;if(id.includes("domain")||id.includes("ip"))return Globe2;if(id.includes("regex"))return Regex;return Search;};

export default function ExtractionHub(){
  const tools=getAllToolsByCategory("extraction");
  return <main className="container mx-auto max-w-7xl px-4 py-10 sm:py-14">
    <section className="mx-auto max-w-3xl text-center"><div className="mx-auto mb-4 inline-flex rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Local-first extraction</div><h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Extract useful data without the busywork.</h1><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">A focused collection of extraction utilities for developers, researchers, SEO work, data cleanup, and everyday copy-paste workflows. Parse text, HTML, JSON, regex, and CSV directly in your browser.</p></section>
    <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{tools.map(tool=>{const Icon=iconFor(tool.id);return <Link key={tool.id} href={tool.route} className="group"><Card className="h-full border-border/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between gap-4"><div className="rounded-lg border border-border/60 bg-muted/40 p-2"><Icon className="h-4 w-4"/></div><ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground"/></div><h2 className="mt-4 text-base font-semibold tracking-tight">{tool.name}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{tool.description}</p></CardContent></Card></Link>})}</section>
    <section className="mx-auto mt-16 max-w-4xl border-t border-border/60 pt-10"><h2 className="text-2xl font-bold tracking-tight">Extraction tools for common data workflows</h2><div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground"><p>Use the URL and domain extractors to turn copied text into clean link inventories. Email, phone, and IP extraction helps transform logs and documents into structured lists without writing a script.</p><p>For web research and SEO, the HTML extractors inspect anchors, image sources, canonical URLs, metadata, Open Graph, Twitter cards, and headings. JSONPath handles nested objects and arrays, while Regex Extractor exposes capture groups and match positions.</p><p>Each tool follows the same workflow: paste or open data, configure only what you need, extract, review, then copy or export. These extraction operations run locally in the browser.</p></div></section>
  </main>;
}
