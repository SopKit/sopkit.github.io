
"use client";
import { Braces, Check, Clipboard, FileText, Filter, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Node = { value: any; path: string };

function tokens(expr: string) {
  const out:any[]=[]; const s=expr.trim(); let i=0;
  if(!s.startsWith("$")) throw new Error("JSONPath must start with $.");
  i=1;
  while(i<s.length){
    if(s.startsWith("..",i)){i+=2; const start=i; while(i<s.length && /[\w$-]/.test(s[i])) i++; out.push({type:"recursive",key:s.slice(start,i)||"*"}); continue;}
    if(s[i]==="."){i++; const start=i; while(i<s.length && /[\w$-]/.test(s[i])) i++; if(start===i) throw new Error("Expected a property after ."); out.push({type:"prop",key:s.slice(start,i)}); continue;}
    if(s[i]==="["){const end=s.indexOf("]",i); if(end<0) throw new Error("Unclosed [] selector."); const inside=s.slice(i+1,end).trim(); if(inside.startsWith("?(")) out.push({type:"filter",expr:inside.slice(2,-1).trim()}); else if(inside.includes(",")) out.push({type:"union",values:inside.split(",").map((x)=>x.trim().replace(/^['"]|['"]$/g,""))}); else if(/^-?\d*:-?\d*(?::-?\d+)?$/.test(inside)){const p=inside.split(":"); out.push({type:"slice",start:p[0]?Number(p[0]):undefined,end:p[1]?Number(p[1]):undefined,step:p[2]?Number(p[2]):1});} else if(inside==="*"||inside==="") out.push({type:"wildcard"}); else if(/^-?\d+$/.test(inside)) out.push({type:"index",index:Number(inside)}); else out.push({type:"prop",key:inside.replace(/^['"]|['"]$/g,"")}); i=end+1; continue;}
    throw new Error("Unexpected token near "+s.slice(i));
  }
  return out;
}

function recursiveFind(node:Node,key:string,out:Node[]){
  if(Array.isArray(node.value)){node.value.forEach((v,i)=>recursiveFind({value:v,path:node.path+"["+i+"]"},key,out));return;}
  if(!node.value||typeof node.value!=="object") return;
  Object.entries(node.value).forEach(([k,v])=>{const child={value:v,path:node.path+"."+k}; if(key==="*"||k===key) out.push(child); recursiveFind(child,key,out);});
}

function filterPass(value:any, expr:string){
  const m=expr.match(/^@(?:\.([\w$-]+))?\s*(==|!=|>=|<=|>|<|contains)\s*(.+)$/); if(!m) return false;
  const actual=m[1]?value?.[m[1]]:value; let expected:any=m[3].trim().replace(/^['"]|['"]$/g,"");
  if(expected==="true") expected=true; else if(expected==="false") expected=false; else if(expected==="null") expected=null; else if(expected!==""&&!Number.isNaN(Number(expected))) expected=Number(expected);
  if(m[2]==="contains") return String(actual).includes(String(expected));
  if(m[2]==="==") return actual===expected; if(m[2]==="!=") return actual!==expected; if(m[2]===">") return actual>expected; if(m[2]==="<") return actual<expected; if(m[2]===">=") return actual>=expected; return actual<=expected;
}

function evaluate(data:any,expr:string){
  let current:Node[]=[{value:data,path:"$"}];
  for(const token of tokens(expr)){
    const next:Node[]=[];
    for(const node of current){
      if(token.type==="prop" && node.value && typeof node.value==="object" && token.key in node.value) next.push({value:node.value[token.key],path:node.path+"."+token.key});
      else if(token.type==="wildcard"){if(Array.isArray(node.value)) node.value.forEach((v:any,i:number)=>next.push({value:v,path:node.path+"["+i+"]"})); else if(node.value&&typeof node.value==="object") Object.entries(node.value).forEach(([k,v])=>next.push({value:v,path:node.path+"."+k}));}
      else if(token.type==="index"&&Array.isArray(node.value)){const i=token.index<0?node.value.length+token.index:token.index;if(i>=0&&i<node.value.length) next.push({value:node.value[i],path:node.path+"["+i+"]"});}
      else if(token.type==="union"&&node.value&&typeof node.value==="object") token.values.forEach((k:string)=>{if(k in node.value) next.push({value:node.value[k],path:node.path+"."+k});});
      else if(token.type==="slice"&&Array.isArray(node.value)){const start=token.start??0,end=token.end??node.value.length,from=start<0?Math.max(0,node.value.length+start):start,to=end<0?Math.max(0,node.value.length+end):end;for(let i=from;i<Math.min(to,node.value.length);i+=token.step) next.push({value:node.value[i],path:node.path+"["+i+"]"});}
      else if(token.type==="recursive") recursiveFind(node,token.key,next);
      else if(token.type==="filter"&&Array.isArray(node.value)) node.value.forEach((v:any,i:number)=>{if(filterPass(v,token.expr)) next.push({value:v,path:node.path+"["+i+"]"});});
    }
    current=next;
  }
  return current;
}

export default function JsonPathExtractorTool(){
  const [input,setInput]=useState(""), [expr,setExpr]=useState("$[*]"), [rows,setRows]=useState<Node[]>([]), [error,setError]=useState("");
  const sample=()=>{setInput('{"store":{"book":[{"title":"Clean Code","price":30},{"title":"Refactoring","price":45}]}}');setExpr("$.store.book[*].title");setRows([]);};
  const run=()=>{try{const data=JSON.parse(input);const result=evaluate(data,expr||"$");setRows(result);setError("");toast.success(result.length+" matches");}catch(e){setRows([]);setError(e instanceof Error?e.message:"Invalid JSONPath");}};
  const copy=async()=>{await navigator.clipboard.writeText(rows.map((r)=>String(r.value)).join("\n"));toast.success("Copied");};
  return <div className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><div className="rounded-xl border border-border/70 bg-muted/40 p-2.5"><Braces className="h-5 w-5"/></div><div><CardTitle className="text-lg">JSONPath Extractor</CardTitle><CardDescription className="mt-1 max-w-2xl">Query nested JSON with properties, arrays, wildcards, recursive descent, slices, unions, and simple comparison filters.</CardDescription></div></div><Button size="sm" variant="outline" onClick={sample}><FileText className="mr-1.5 h-3.5 w-3.5"/>Sample</Button></div>
    <label><span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">JSONPath expression</span><input value={expr} onChange={(e)=>setExpr(e.target.value)} placeholder="$.users[*].email" className="h-10 w-full rounded-lg border border-border/70 bg-background px-3 font-mono text-sm"/></label>
    <Card className="border-border/60 shadow-none"><CardHeader className="pb-3"><CardTitle className="text-sm">JSON input</CardTitle><CardDescription className="text-xs">Everything is parsed locally in the browser.</CardDescription></CardHeader><CardContent className="space-y-3"><Textarea value={input} onChange={(e)=>setInput(e.target.value)} rows={13} placeholder='{"users":[{"name":"Ada"}]}' className="min-h-[260px] resize-y font-mono text-xs sm:text-sm" spellCheck={false}/><div className="flex justify-end"><Button onClick={run} disabled={!input.trim()}><Filter className="mr-2 h-4 w-4"/>Extract</Button></div></CardContent></Card>
    {error&&<div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div>}
    {rows.length>0&&<Card className="overflow-hidden border-border/60"><CardHeader className="border-b border-border/50 py-3.5"><div className="flex justify-between gap-2"><div><CardTitle className="text-sm">{rows.length} matches</CardTitle><CardDescription className="text-xs">Values and JSON paths are shown together.</CardDescription></div><div className="flex gap-1.5"><Button size="sm" variant="outline" onClick={copy}><Clipboard className="mr-1.5 h-3.5 w-3.5"/>Copy values</Button></div></div></CardHeader><CardContent className="p-0"><div className="max-h-[560px] overflow-auto divide-y divide-border/40">{rows.slice(0,2000).map((row,i)=><div key={String(i)+row.path} className="grid grid-cols-[auto_1fr] gap-3 px-4 py-3"><span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">{i+1}</span><div><div className="font-mono text-sm break-words">{typeof row.value==="string"?row.value:JSON.stringify(row.value)}</div><div className="mt-1"><button type="button" className="font-mono text-[11px] text-muted-foreground hover:text-foreground hover:underline" onClick={()=>navigator.clipboard.writeText(row.path)}>{row.path}</button></div></div></div>)}</div></CardContent></Card>}
  </div>;
}
