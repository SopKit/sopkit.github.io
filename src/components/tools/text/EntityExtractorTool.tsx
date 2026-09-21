
"use client";
import { Check, Clipboard, Download, FileText, Filter, Globe2, Link2, Mail, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Mode = "email" | "phone" | "ip" | "domain";
type Row = { value: string; detail: string };

const META: Record<Mode, { title: string; description: string; placeholder: string; sample: string; icon: any }> = {
  email: { title: "Extract Email Addresses", description: "Extract, normalize, deduplicate, and export email-like addresses locally.", placeholder: "Paste contacts, HTML, notes, logs, or document text…", sample: "alice@example.com\\nsupport@sopkit.space\\nalice@example.com\\nsales@example.org", icon: Mail },
  phone: { title: "Extract Phone Numbers", description: "Find phone-like number sequences from notes, logs, contact lists, and copied text.", placeholder: "Paste text containing phone numbers…", sample: "+91 98765 43210\\n+1 (415) 555-0137\\n011-23456789", icon: Search },
  ip: { title: "Extract IP Addresses", description: "Find IPv4 and IPv6 addresses and classify each extracted value.", placeholder: "Paste server logs, headers, diagnostics, or text…", sample: "Request from 192.168.1.22\\nGateway 10.0.0.1\\nIPv6 2001:db8::8a2e:370:7334", icon: Globe2 },
  domain: { title: "Extract Domains", description: "Turn URLs and email addresses into a clean domain inventory.", placeholder: "Paste URLs, emails, links, logs, or hostnames…", sample: "https://www.google.com/search?q=test\\nhello@example.com\\nhttps://docs.github.com/en", icon: Link2 },
};

function unique(rows: Row[]) {
  const seen = new Set<string>();
  return rows.filter((r) => {
    const key = r.value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function EntityExtractorTool({ mode }: { mode: Mode }) {
  const meta = META[mode];
  const Icon = meta.icon;
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [uniqueOnly, setUniqueOnly] = useState(true);
  const [sort, setSort] = useState(false);
  const [copied, setCopied] = useState(false);

  const extract = () => {
    let result: Row[] = [];
    if (mode === "email") {
      result = (input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []).map((value) => ({ value: value.toLowerCase().replace(/[),.;:]+$/g, ""), detail: "@" + value.split("@")[1] }));
    } else if (mode === "phone") {
      result = (input.match(/(?:\+?\d[\d .()\-]{7,}\d)/g) || []).map((value) => value.trim().replace(/[),.;:]+$/g, "")).filter((value) => value.replace(/\D/g, "").length >= 8).map((value) => ({ value, detail: value.replace(/\D/g, "").length + " digits" }));
    } else if (mode === "ip") {
      const v4 = input.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];
      const v6 = input.match(/\b(?:[a-f0-9]{1,4}:){2,7}[a-f0-9]{1,4}\b/gi) || [];
      result = [...v4.map((value) => ({ value, detail: value.split(".").every((x) => Number(x) <= 255) ? "IPv4" : "IPv4-like" })), ...v6.map((value) => ({ value, detail: "IPv6" }))];
    } else {
      const urls = input.match(/(?:https?:\/\/|www\.)[^\s<>"']+/gi) || [];
      const emails = input.match(/[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}/gi) || [];
      for (const raw of urls) { try { const value = new URL(raw.startsWith("www.") ? "https://" + raw : raw).hostname.replace(/^www\\./, "").toLowerCase(); result.push({ value, detail: "URL hostname" }); } catch {} }
      for (const raw of emails) result.push({ value: raw.split("@").pop()!.toLowerCase(), detail: "email domain" });
    }
    if (uniqueOnly) result = unique(result);
    if (sort) result.sort((a, b) => a.value.localeCompare(b.value, undefined, { numeric: true }));
    setRows(result);
    toast.success(result.length.toLocaleString() + " results extracted");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(rows.map((r) => r.value).join("\n"));
    setCopied(true);
    toast.success("Copied");
    window.setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => { setInput(""); setRows([]); };
  const sample = () => { setInput(meta.sample); setRows([]); };

  const exportRows = (kind: "txt" | "csv" | "json") => {
    if (!rows.length) return;
    const content = kind === "txt" ? rows.map((r) => r.value).join("\n") : kind === "json" ? JSON.stringify(rows, null, 2) : ["value,detail", ...rows.map((r) => "\"" + r.value.replace(/"/g, "\"\"") + "\",\"" + r.detail.replace(/"/g, "\"\"") + "\"")].join("\n");
    const href = URL.createObjectURL(new Blob([content], { type: kind === "json" ? "application/json" : kind === "csv" ? "text/csv" : "text/plain" }));
    const a = document.createElement("a"); a.href = href; a.download = mode + "-results." + kind; a.click(); URL.revokeObjectURL(href);
  };

  return <div className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-3"><div className="rounded-xl border border-border/70 bg-muted/40 p-2.5"><Icon className="h-5 w-5" /></div><div><CardTitle className="text-lg">{meta.title}</CardTitle><CardDescription className="mt-1 max-w-2xl">{meta.description}</CardDescription></div></div>
      <div className="flex gap-2"><Button size="sm" variant="outline" onClick={sample}><FileText className="mr-1.5 h-3.5 w-3.5" />Sample</Button><Button size="sm" variant="ghost" onClick={clear} disabled={!input && !rows.length}><X className="mr-1.5 h-3.5 w-3.5" />Clear</Button></div>
    </div>
    <Card className="border-border/60 shadow-none"><CardHeader className="pb-3"><CardTitle className="text-sm">Input</CardTitle><CardDescription className="text-xs">Parsing happens locally in your browser.</CardDescription></CardHeader><CardContent className="space-y-3"><Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={11} placeholder={meta.placeholder} className="min-h-[220px] resize-y font-mono text-xs sm:text-sm" spellCheck={false} /><div className="flex flex-wrap gap-4 text-xs text-muted-foreground"><label className="inline-flex items-center gap-2"><input type="checkbox" checked={uniqueOnly} onChange={(e) => setUniqueOnly(e.target.checked)} />Deduplicate</label><label className="inline-flex items-center gap-2"><input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} />Sort A–Z</label></div><div className="flex justify-end"><Button onClick={extract} disabled={!input.trim()}><Filter className="mr-2 h-4 w-4" />Extract</Button></div></CardContent></Card>
    {rows.length > 0 && <Card className="overflow-hidden border-border/60"><CardHeader className="border-b border-border/50 py-3.5"><div className="flex flex-wrap items-center justify-between gap-2"><div><CardTitle className="text-sm">Results · {rows.length}</CardTitle><CardDescription className="text-xs">Copy or export the extracted values.</CardDescription></div><div className="flex flex-wrap gap-1.5"><Button size="sm" variant="outline" onClick={copy}>{copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Clipboard className="mr-1.5 h-3.5 w-3.5" />}{copied ? "Copied" : "Copy"}</Button><Button size="sm" variant="outline" onClick={() => exportRows("csv")}>CSV</Button><Button size="sm" variant="outline" onClick={() => exportRows("json")}>JSON</Button><Button size="sm" variant="outline" onClick={() => exportRows("txt")}><Download className="mr-1.5 h-3.5 w-3.5" />TXT</Button></div></div></CardHeader><CardContent className="p-0"><div className="max-h-[520px] overflow-auto divide-y divide-border/40">{rows.slice(0, 2000).map((row, i) => <div key={String(i) + row.value} className="grid grid-cols-[auto_1fr] gap-3 px-4 py-3 hover:bg-muted/20"><Badge variant="secondary" className="h-5 font-mono text-[10px]">{i + 1}</Badge><div className="min-w-0"><div className="break-words font-mono text-sm">{row.value}</div><div className="mt-1 text-[11px] text-muted-foreground">{row.detail}</div></div></div>)}</div></CardContent></Card>}
  </div>;
}
