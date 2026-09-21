
"use client";
import { Copy, Download, FileText, Regex, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const PRESETS = {
  email: "[\\w.+-]+@[\\w-]+\\.[A-Za-z]{2,}",
  url: "https?://[^\\s<>\"']+",
  phone: "(?:\\+?\\d[\\d .()\\-]{7,}\\d)",
  ipv4: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
  hex: "#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b",
};

export default function RegexExtractorTool(){
  const [input,setInput]=useState(""),[pattern,setPattern]=useState(PRESETS.email),[flags,setFlags]=useState("gi"),[rows,setRows]=useState<Array<{match:string,index:number,groups:string[]}>>([]),[error,setError]=useState("");
  const run=()=>{try{const re=new RegExp(pattern,flags||"g"),out:Array<{match:string,index:number,groups:string[]}>=[];if(re.global){let m:RegExpExecArray|null;while((m=re.exec(input))&&out.length<5000){out.push({match:m[0],index:m.index,groups:m.slice(1)});if(!m[0])re.lastIndex++;}}else{const m=re.exec(input);if(m)out.push({match:m[0],index:m.index,groups:m.slice(1)});}setRows(out);setError("");toast.success(out.length+" matches");}catch(e){setRows([]);setError(e instanceof Error?e.message:"Invalid regular expression");}};
  const sample=()=>setInput("Order #A-1042, #B-2051 and support@example.com were processed.");
  const copy=async()=>{await navigator.clipboard.writeText(rows.map(r=>r.match).join("\n"));toast.success("Copied");};
  const exportJson=()=>{const href=URL.createObjectURL(new Blob([JSON.stringify(rows,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=href;a.download="regex-results.json";a.click();URL.revokeObjectURL(href);};
  return <div className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><div className="rounded-xl border border-border/70 bg-muted/40 p-2.5"><Regex className="h-5 w-5"/></div><div><CardTitle className="text-lg">Regex Extractor</CardTitle><CardDescription className="mt-1 max-w-2xl">Extract matches, capture groups, and character positions from arbitrary text with reusable presets.</CardDescription></div></div><Button size="sm" variant="outline" onClick={sample}><FileText className="mr-1.5 h-3.5 w-3.5"/>Sample</Button></div>
    <div className="flex flex-col gap-2 sm:flex-row"><input value={pattern} onChange={(e)=>setPattern(e.target.value)} className="h-10 flex-1 rounded-lg border border-border/70 bg-background px-3 font-mono text-sm" placeholder="Regular expression"/><input value={flags} onChange={(e)=>setFlags(e.target.value)} className="h-10 w-full rounded-lg border border-border/70 bg-background px-3 font-mono text-sm sm:w-24" placeholder="flags"/></div>
    <div className="flex flex-wrap gap-1.5">{Object.entries(PRESETS).map(([name,value])=><Button key={name} size="sm" variant="outline" className="h-7 text-[11px]" onClick={()=>setPattern(value)}>{name}</Button>)}</div>
    <Card className="border-border/60 shadow-none"><CardHeader className="pb-3"><CardTitle className="text-sm">Input</CardTitle><CardDescription className="text-xs">Regex processing happens locally in the browser.</CardDescription></CardHeader><CardContent className="space-y-3"><Textarea value={input} onChange={(e)=>setInput(e.target.value)} rows={12} className="min-h-[240px] resize-y font-mono text-xs sm:text-sm" placeholder="Paste text to search…" spellCheck={false}/><div className="flex justify-end"><Button onClick={run} disabled={!input.trim()}>Extract</Button></div></CardContent></Card>
    {error&&<div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div>}
    {rows.length>0&&<Card className="overflow-hidden border-border/60"><CardHeader className="border-b border-border/50 py-3.5"><div className="flex flex-wrap items-center justify-between gap-2"><div><CardTitle className="text-sm">{rows.length} matches</CardTitle><CardDescription className="text-xs">Capture groups and match offsets are preserved.</CardDescription></div><div className="flex gap-1.5"><Button size="sm" variant="outline" onClick={copy}><Copy className="mr-1.5 h-3.5 w-3.5"/>Copy</Button><Button size="sm" variant="outline" onClick={exportJson}><Download className="mr-1.5 h-3.5 w-3.5"/>JSON</Button></div></div></CardHeader><CardContent className="p-0"><div className="max-h-[560px] overflow-auto divide-y divide-border/40">{rows.map((row,i)=><div key={String(i)+row.index} className="px-4 py-3"><div className="font-mono text-sm break-words">{row.match}</div><div className="mt-1 text-[11px] text-muted-foreground">position {row.index}{row.groups.length? " · "+row.groups.map((g,j)=>"g"+(j+1)+"="+(g||"")).join(" · "):""}</div></div>)}</div></CardContent></Card>}
  </div>;
}
