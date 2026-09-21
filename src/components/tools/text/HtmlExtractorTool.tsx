
"use client";
import { Code2, Download, FileCode2, FileText, Link2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Mode = "link" | "image" | "meta";
type Row = { value: string; detail: string };

const config = {
  link: { title: "HTML Link Extractor", description: "Extract anchor URLs, visible text, rel, target, and resolved relative links from raw HTML.", icon: Link2, sample: "<a href=\"/docs\" rel=\"next\">Documentation</a>\n<a href=\"https://example.com\" target=\"_blank\">Example</a>" },
  image: { title: "HTML Image Extractor", description: "Extract image sources from img, srcset, picture sources, Open Graph, and Twitter metadata.", icon: ImageIcon, sample: "<img src=\"/hero.png\" alt=\"Hero\">\n<meta property=\"og:image\" content=\"https://example.com/og.png\">" },
  meta: { title: "HTML Metadata Extractor", description: "Inspect title, description, canonical, robots, Open Graph, Twitter, favicon, language, and headings.", icon: FileCode2, sample: "<title>SopKit — Free Online Tools</title>\n<meta name=\"description\" content=\"Browser utilities\">\n<link rel=\"canonical\" href=\"https://sopkit.space/\">" },
} as const;

export default function HtmlExtractorTool({ mode }: { mode: Mode }) {
  const cfg = config[mode], Icon = cfg.icon;
  const [input, setInput] = useState(""), [baseUrl, setBaseUrl] = useState(""), [rows, setRows] = useState<Row[]>([]);
  const extract = () => {
    const doc = new DOMParser().parseFromString(input, "text/html");
    const output: Row[] = [];
    const add = (value: string | null, detail: string) => { if (value?.trim()) output.push({ value: value.trim(), detail }); };
    if (mode === "link") {
      doc.querySelectorAll("a[href]").forEach((a) => {
        let value = a.getAttribute("href") || "";
        try { if (baseUrl) value = new URL(value, baseUrl).href; } catch {}
        add(value, [(a.textContent || "").replace(/\s+/g, " ").trim(), a.getAttribute("rel") && "rel=" + a.getAttribute("rel"), a.getAttribute("target") && "target=" + a.getAttribute("target")].filter(Boolean).join(" · "));
      });
    } else if (mode === "image") {
      doc.querySelectorAll("img,source,meta[property='og:image'],meta[name='twitter:image']").forEach((node) => {
        const resolve = (value: string) => { try { return baseUrl ? new URL(value, baseUrl).href : value; } catch { return value; } };
        add(node.getAttribute("src") ? resolve(node.getAttribute("src") || "") : node.getAttribute("content"), node.getAttribute("alt") || node.getAttribute("property") || node.getAttribute("name") || node.tagName.toLowerCase());
        const srcset = node.getAttribute("srcset");
        if (srcset) srcset.split(",").map((x) => x.trim().split(/\s+/)[0]).filter(Boolean).forEach((value) => add(resolve(value), "srcset"));
      });
    } else {
      add(doc.title, "title");
      add(doc.documentElement.getAttribute("lang"), "lang");
      add(doc.querySelector("link[rel='canonical']")?.getAttribute("href") || null, "canonical");
      add(doc.querySelector("meta[name='robots']")?.getAttribute("content") || null, "robots");
      add(doc.querySelector("meta[name='description']")?.getAttribute("content") || null, "description");
      add(doc.querySelector("meta[name='theme-color']")?.getAttribute("content") || null, "theme-color");
      add(doc.querySelector("link[rel*='icon']")?.getAttribute("href") || null, "favicon");
      doc.querySelectorAll("meta[property^='og:']").forEach((n) => add(n.getAttribute("content"), n.getAttribute("property") || "og"));
      doc.querySelectorAll("meta[name^='twitter:']").forEach((n) => add(n.getAttribute("content"), n.getAttribute("name") || "twitter"));
      ["h1","h2","h3"].forEach((tag) => doc.querySelectorAll(tag).forEach((n) => add((n.textContent || "").replace(/\s+/g, " "), tag)));
    }
    const seen = new Set<string>();
    setRows(output.filter((row) => { const key = row.value.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; }));
    toast.success(output.length + " values found");
  };
  const sample = () => setInput(cfg.sample);
  const copy = async () => { await navigator.clipboard.writeText(rows.map((r) => r.value).join("\n")); toast.success("Copied"); };
  const exportTxt = () => { const href = URL.createObjectURL(new Blob([rows.map((r) => r.value).join("\n")], {type:"text/plain"})); const a=document.createElement("a"); a.href=href; a.download=mode+"-results.txt"; a.click(); URL.revokeObjectURL(href); };
  const IconButton = mode === "link" ? Code2 : Icon;
  return <div className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><div className="rounded-xl border border-border/70 bg-muted/40 p-2.5"><IconButton className="h-5 w-5" /></div><div><CardTitle className="text-lg">{cfg.title}</CardTitle><CardDescription className="mt-1 max-w-2xl">{cfg.description}</CardDescription></div></div><Button size="sm" variant="outline" onClick={sample}><FileText className="mr-1.5 h-3.5 w-3.5" />Sample</Button></div>
    {(mode === "link" || mode === "image") && <input value={baseUrl} onChange={(e)=>setBaseUrl(e.target.value)} placeholder="Optional base URL, e.g. https://example.com/" className="h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm" />}
    <Card className="border-border/60 shadow-none"><CardHeader className="pb-3"><CardTitle className="text-sm">HTML source</CardTitle><CardDescription className="text-xs">The parser runs locally in your browser.</CardDescription></CardHeader><CardContent className="space-y-3"><Textarea value={input} onChange={(e)=>setInput(e.target.value)} rows={13} placeholder="Paste HTML source here…" className="min-h-[260px] resize-y font-mono text-xs sm:text-sm" spellCheck={false}/><div className="flex justify-end"><Button onClick={extract} disabled={!input.trim()}>Extract</Button></div></CardContent></Card>
    {rows.length>0 && <Card className="overflow-hidden border-border/60"><CardHeader className="border-b border-border/50 py-3.5"><div className="flex flex-wrap justify-between gap-2"><div><CardTitle className="text-sm">Results · {rows.length}</CardTitle><CardDescription className="text-xs">Review, copy, or export the extracted values.</CardDescription></div><div className="flex gap-1.5"><Button size="sm" variant="outline" onClick={copy}>Copy</Button><Button size="sm" variant="outline" onClick={exportTxt}><Download className="mr-1.5 h-3.5 w-3.5"/>TXT</Button></div></div></CardHeader><CardContent className="p-0"><div className="max-h-[560px] overflow-auto divide-y divide-border/40">{rows.map((row,i)=><div key={String(i)+row.value} className="px-4 py-3"><div className="break-words font-mono text-xs sm:text-sm">{row.value}</div><div className="mt-1 text-[11px] text-muted-foreground">{row.detail}</div></div>)}</div></CardContent></Card>}
  </div>;
}
