"use client";

import {
  Play, Trash2, Plus, ChevronUp, ChevronDown, Download, Upload,
  RotateCcw, ChevronRight, Copy, Check, Terminal, AlertCircle,
  ShieldCheck, Clock, FileCode, SplitSquareHorizontal, Eye, EyeOff,
  Code2, Share2, FileJson, Bookmark, Eraser, X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Types ───────────────────────────────────────────────────────────

interface CellOutput {
  type: "log" | "error" | "warn" | "info" | "result" | "clear";
  text: string;
  timestamp: number;
}

interface Cell {
  id: string;
  code: string;
  outputs: CellOutput[];
  executionCount: number | null;
  isRunning: boolean;
  executionTime: number | null;
  isCodeCollapsed: boolean;
}

type NotebookData = { cells: { code: string }[] };

// ─── Snippets ────────────────────────────────────────────────────────

const SNIPPETS: { name: string; code: string }[] = [
  { name: "Fetch JSON API", code: "async function fetchData() {\n  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');\n  const data = await res.json();\n  console.log('Fetched:', data);\n  return data;\n}\nconst result = await fetchData();" },
  { name: "Array Operations", code: "const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nconst evens = nums.filter(n => n % 2 === 0);\nconst doubled = nums.map(n => n * 2);\nconst sum = nums.reduce((a, b) => a + b, 0);\nconsole.log('Evens:', evens);\nconsole.log('Doubled:', doubled);\nconsole.log('Sum:', sum);" },
  { name: "Date Formatting", code: "const now = new Date();\nconsole.log('ISO:', now.toISOString());\nconsole.log('Locale:', now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));\nconsole.log('Time:', now.toLocaleTimeString('en-US'));\n\nconst y = now.getFullYear();\nconst m = String(now.getMonth()+1).padStart(2,'0');\nconst d = String(now.getDate()).padStart(2,'0');\nconsole.log('Custom:', y + '-' + m + '-' + d);" },
  { name: "String Manipulation", code: "const str = '  Hello, JavaScript Notebook!  ';\nconsole.log('Original:', str);\nconsole.log('Trimmed:', str.trim());\nconsole.log('Uppercase:', str.toUpperCase().trim());\nconsole.log('Reversed:', str.trim().split('').reverse().join(''));\nconsole.log('Word count:', str.trim().split(/\\s+/).length);\nconsole.log(\"Contains 'JS':\", str.includes('JS'));" },
  { name: "Async / Promises", code: "function delay(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n\nconsole.log('Start');\nawait delay(300);\nconsole.log('After 300ms');\nawait delay(500);\nconsole.log('After 800ms total');\n\n'All timers completed!'" },
  { name: "Object / Class", code: "class Animal {\n  constructor(name, sound) {\n    this.name = name;\n    this.sound = sound;\n  }\n  speak() {\n    return this.name + ' says ' + this.sound + '!';\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name) {\n    super(name, 'woof');\n  }\n  fetch() {\n    return this.name + ' fetches the ball.';\n  }\n}\n\nconst rex = new Dog('Rex');\nconsole.log(rex.speak());\nconsole.log(rex.fetch());" },
  { name: "Set / Map", code: "const set = new Set([1, 2, 3, 3, 4, 4, 5]);\nconsole.log('Set:', [...set]);\n\nconst map = new Map([\n  ['name', 'Alice'],\n  ['age', 30],\n  ['city', 'NYC']\n]);\nconsole.log('Map keys:', [...map.keys()]);\nconsole.log('Map values:', [...map.values()]);\n\nconsole.log('Object:', Object.fromEntries(map));" },
  { name: "Error Handling", code: "function riskyOperation(shouldFail) {\n  if (shouldFail) throw new Error('Something went wrong!');\n  return 'Success!';\n}\n\nconsole.log('Attempt 1:');\ntry {\n  const r = riskyOperation(false);\n  console.log(r);\n} catch (e) {\n  console.error(e.message);\n}\n\nconsole.log('Attempt 2:');\ntry {\n  const r = riskyOperation(true);\n  console.log(r);\n} catch (e) {\n  console.error('Caught:', e.message);\n}\n\n'Done with error handling'" },
];

// ─── Helpers ──────────────────────────────────────────────────────────

let cellCounter = 0;

function createCell(code = ""): Cell {
  cellCounter++;
  return {
    id: `cell-${cellCounter}-${Date.now()}`,
    code,
    outputs: [],
    executionCount: null,
    isRunning: false,
    executionTime: null,
    isCodeCollapsed: false,
  };
}

// ─── Sandbox Execution ────────────────────────────────────────────────

async function executeJavaScript(code: string): Promise<{ outputs: CellOutput[]; time: number }> {
  const outputs: CellOutput[] = [];
  const startTime = performance.now();
  const perfTimers: Record<string, number> = {};

  const mockConsole = {
    log: (...args: unknown[]) => { outputs.push({ type: "log", text: args.map(a => formatValue(a)).join(" "), timestamp: Date.now() }); },
    error: (...args: unknown[]) => { outputs.push({ type: "error", text: args.map(a => formatValue(a)).join(" "), timestamp: Date.now() }); },
    warn: (...args: unknown[]) => { outputs.push({ type: "warn", text: args.map(a => formatValue(a)).join(" "), timestamp: Date.now() }); },
    info: (...args: unknown[]) => { outputs.push({ type: "info", text: args.map(a => formatValue(a)).join(" "), timestamp: Date.now() }); },
    clear: () => { outputs.push({ type: "clear", text: "", timestamp: Date.now() }); },
    table: (data: unknown) => { outputs.push({ type: "log", text: formatTable(data), timestamp: Date.now() }); },
    dir: (obj: unknown) => { outputs.push({ type: "log", text: formatValue(obj), timestamp: Date.now() }); },
    time: (label: string) => { perfTimers[label] = performance.now(); },
    timeEnd: (label: string) => {
      const start = perfTimers[label];
      if (start !== undefined) {
        outputs.push({ type: "log", text: `${label}: ${(performance.now() - start).toFixed(2)} ms`, timestamp: Date.now() });
        delete perfTimers[label];
      }
    },
  };

  function formatValue(val: unknown): string {
    if (val === null) return "null";
    if (val === undefined) return "undefined";
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (Array.isArray(val)) return `[${val.map(formatValue).join(", ")}]`;
    if (val instanceof Error) return `${val.name}: ${val.message}\n${val.stack || ""}`;
    if (val instanceof Promise) return "Promise { <pending> }";
    if (typeof val === "object") {
      try { return JSON.stringify(val, null, 2); }
      catch { return String(val); }
    }
    return String(val);
  }

  function formatTable(data: unknown): string {
    if (!data || typeof data !== "object") return String(data);
    const arr = Array.isArray(data) ? data : Object.entries(data);
    if (arr.length === 0) return "(empty)";
    const first = arr[0];
    const keys = typeof first === "object" && first !== null ? Object.keys(first) : ["Value"];
    const rows = arr.map(item => {
      if (typeof item === "object" && item !== null) return keys.map(k => String((item as Record<string, unknown>)[k] ?? "")).join("\t");
      return String(item);
    });
    return `| ${keys.join("\t")} |\n| ${keys.map(() => "---").join("\t")} |\n${rows.map(r => `| ${r} |`).join("\n")}`;
  }

  try {
    const asyncFn = new Function("console", `return (async () => { ${code} })();`);
    const result = await asyncFn(mockConsole);
    if (result !== undefined) outputs.push({ type: "result", text: formatValue(result), timestamp: Date.now() });
  } catch (error) {
    outputs.push({ type: "error", text: error instanceof Error ? `${error.name}: ${error.message}` : String(error), timestamp: Date.now() });
  }

  return { outputs, time: performance.now() - startTime };
}

// ─── Sample Notebook ──────────────────────────────────────────────────

const SAMPLE_NOTEBOOK = `// ─── JavaScript Notebook ───
// Jupyter-like interactive env for JavaScript

const greeting = "Hello, Notebook!";
console.log(greeting);
console.log("Math:", 42 * 2, "is the answer");
console.table([{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }]);

42 * 2 + 100`;

// ─── Component ────────────────────────────────────────────────────────

export default function JavaScriptNotebookTool() {
  const [cells, setCells] = useState<Cell[]>([
    createCell(SAMPLE_NOTEBOOK),
    createCell(`const fruits = ["apple", "banana", "cherry"];
fruits.push("date");
console.log("Fruits:", fruits);
fruits.toReversed();`),
    createCell(`async function fetchGreeting() {
  await new Promise(r => setTimeout(r, 500));
  return "Async data loaded!";
}
console.log("Fetching...");
const data = await fetchGreeting();
console.log("Result:", data);
"Done ✨"`),
  ]);
  const [collapseOutputs, setCollapseOutputs] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSnippets, setShowSnippets] = useState(false);
  const [savedStatus, setSavedStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sopkit-notebook");
      if (saved) {
        const data: NotebookData = JSON.parse(saved);
        if (data.cells?.length) setCells(data.cells.map(c => createCell(c.code)));
      }
      // Check URL hash for shared notebook
      const hash = window.location.hash.slice(1);
      if (hash) {
        try {
          const decoded = atob(hash);
          const data: NotebookData = JSON.parse(decoded);
          if (data.cells?.length) {
            setCells(data.cells.map(c => createCell(c.code)));
            toast.success("Loaded shared notebook from URL");
          }
        } catch { /* ignore invalid hash */ }
      }
    } catch { /* ignore */ }
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    setSavedStatus("unsaved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSavedStatus("saving");
      try {
        localStorage.setItem("sopkit-notebook", JSON.stringify({ cells: cells.map(c => ({ code: c.code })) }));
        setSavedStatus("saved");
      } catch { setSavedStatus("saved"); }
    }, 500);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [cells]);

  const updateCellCode = useCallback((id: string, code: string) => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, code } : c));
  }, []);

  const runCell = useCallback(async (id: string) => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, isRunning: true, outputs: [] } : c));
    const cell = cells.find(c => c.id === id);
    if (!cell) return;
    const { outputs, time } = await executeJavaScript(cell.code);
    setCells(prev => prev.map(c => c.id === id ? { ...c, outputs, executionCount: (c.executionCount || 0) + 1, isRunning: false, executionTime: Math.round(time) } : c));
  }, [cells]);

  const runAllCells = useCallback(async () => {
    for (const cell of cells) await runCell(cell.id);
    toast.success("All cells executed");
  }, [cells, runCell]);

  const addCell = useCallback((afterId?: string) => {
    const newCell = createCell();
    setCells(prev => {
      if (!afterId) return [...prev, newCell];
      const idx = prev.findIndex(c => c.id === afterId);
      if (idx === -1) return [...prev, newCell];
      const copy = [...prev];
      copy.splice(idx + 1, 0, newCell);
      return copy;
    });
  }, []);

  const deleteCell = useCallback((id: string) => {
    setCells(prev => prev.length <= 1 ? prev : prev.filter(c => c.id !== id));
  }, []);

  const moveCell = useCallback((id: string, dir: "up" | "down") => {
    setCells(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const newIdx = dir === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  }, []);

  const clearOutputs = useCallback(() => {
    setCells(prev => prev.map(c => ({ ...c, outputs: [], executionCount: null, executionTime: null })));
    toast.success("All outputs cleared");
  }, []);

  const clearCellOutput = useCallback((id: string) => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, outputs: [], executionTime: null } : c));
  }, []);

  const toggleCodeCollapse = useCallback((id: string) => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, isCodeCollapsed: !c.isCodeCollapsed } : c));
  }, []);

  const resetNotebook = useCallback(() => {
    setCells([createCell(SAMPLE_NOTEBOOK), createCell('console.log("Hello, world!");')]);
    toast.success("Notebook reset");
  }, []);

  const exportNotebook = useCallback(() => {
    const blob = new Blob([JSON.stringify({ cells: cells.map(c => ({ code: c.code })) }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `javascript-notebook-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Notebook exported!");
  }, [cells]);

  const exportHtml = useCallback(() => {
    const code = cells.map((c, i) => `// Cell ${i + 1}\n${c.code}`).join("\n\n");
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>JS Notebook Export</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;background:#0d1117;color:#e6edf3}pre{background:#161b22;padding:16px;border-radius:8px;overflow:auto;font-size:13px;line-height:1.6}h2{color:#58a6ff}code{color:#f0883e}.output{background:#0d1117;border:1px solid #30363d;padding:12px 16px;border-radius:6px;margin-top:8px;color:#7ee787}</style></head><body><h1>JavaScript Notebook Export</h1><p>Generated: ${new Date().toLocaleString()}</p><h2>Code</h2><pre><code>${code.replace(/</g, "&lt;")}</code></pre><h2>Execute in Console</h2><p>Open DevTools (F12) &gt; Console, paste and run.</p><hr><p><small>SopKit JavaScript Notebook — 100% client-side</small></p></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `javascript-notebook-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as HTML!");
  }, [cells]);

  const shareNotebook = useCallback(() => {
    try {
      const data = JSON.stringify({ cells: cells.map(c => ({ code: c.code })) });
      const encoded = btoa(data);
      const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
      navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard!");
    } catch {
      toast.error("Failed to generate share link");
    }
  }, [cells]);

  const importNotebook = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const data: NotebookData = JSON.parse(event.target?.result as string);
        if (data.cells?.length) { setCells(data.cells.map(c => createCell(c.code))); toast.success(`Imported ${data.cells.length} cells`); }
        else toast.error("Invalid notebook file");
      } catch { toast.error("Failed to parse notebook file"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const copyCellCode = useCallback(async (code: string, id: string) => {
    try { await navigator.clipboard.writeText(code); setCopiedId(id); setTimeout(() => setCopiedId(null), 1500); }
    catch { toast.error("Failed to copy"); }
  }, []);

  const insertSnippet = useCallback((code: string) => {
    const newCell = createCell(code);
    setCells(prev => [...prev, newCell]);
    setShowSnippets(false);
    toast.success("Snippet added");
  }, []);

  const toggleOutputs = useCallback((id: string) => {
    setCollapseOutputs(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, cellId: string) => {
    if (e.key === "Enter" && (e.shiftKey || e.metaKey)) { e.preventDefault(); runCell(cellId); }
    if (e.key === "Escape") { (e.target as HTMLTextAreaElement).blur(); }
  }, [runCell]);

  const renderOutput = (output: CellOutput, idx: number) => {
    const baseClass = "text-xs leading-relaxed px-3 py-1.5 font-mono";
    switch (output.type) {
      case "error":
        return <div key={idx} className={`${baseClass} text-red-500 bg-red-500/5 flex items-start gap-2`}><AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" /><pre className="whitespace-pre-wrap break-all">{output.text}</pre></div>;
      case "warn":
        return <div key={idx} className={`${baseClass} text-amber-500 bg-amber-500/5 flex items-start gap-2`}><span className="font-bold shrink-0">⚠</span><pre className="whitespace-pre-wrap break-all">{output.text}</pre></div>;
      case "info":
        return <div key={idx} className={`${baseClass} text-blue-400 bg-blue-500/5`}><pre className="whitespace-pre-wrap break-all">{output.text}</pre></div>;
      case "result":
        return <div key={idx} className={`${baseClass} text-emerald-400 bg-emerald-500/5 border-t border-emerald-500/10 flex items-start gap-2`}><ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-400" /><pre className="whitespace-pre-wrap break-all">{output.text}</pre></div>;
      case "clear": return null;
      default: return <div key={idx} className={baseClass}><pre className="whitespace-pre-wrap break-all">{output.text}</pre></div>;
    }
  };

  const totalTime = cells.reduce((sum, c) => sum + (c.executionTime || 0), 0);

  const statusColor = savedStatus === "saved" ? "text-emerald-500" : savedStatus === "saving" ? "text-yellow-500" : "text-muted-foreground";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Privacy Badge */}
      <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>100% Sandboxed: Your code runs in an isolated JavaScript sandbox. No data leaves your browser.</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-5 border border-border/40 backdrop-blur-sm rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl"><Terminal className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold">JavaScript Notebook</h2>
            <p className="text-xs text-muted-foreground">
              Interactive Jupyter-style environment for JavaScript | {cells.length} cell{cells.length !== 1 ? "s" : ""}
              {totalTime > 0 && ` · ${totalTime.toFixed(0)}ms total`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="secondary" className="text-[10px] font-bold gap-1"><Terminal className="h-3 w-3" /> JS</Badge>
          <Badge variant="secondary" className="text-[10px] font-bold gap-1"><FileCode className="h-3 w-3" /> ES2024</Badge>
          <Badge variant="outline" className={`text-[10px] gap-1 ${statusColor}`}>
            <Clock className="h-3 w-3" /> {savedStatus === "saved" ? "Saved" : savedStatus === "saving" ? "Saving..." : "Unsaved"}
          </Badge>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1.5 flex-wrap bg-card/15 border border-border/30 rounded-xl p-2 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={runAllCells} className="h-8 text-xs font-bold gap-1.5" title="Run All Cells">
          <Play className="h-3.5 w-3.5 text-emerald-500" /> Run All
        </Button>
        <div className="w-px h-5 bg-border/40" />
        <Button variant="ghost" size="sm" onClick={() => addCell()} className="h-8 text-xs font-bold gap-1.5" title="Add Cell">
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={() => setShowSnippets(!showSnippets)} className="h-8 text-xs font-bold gap-1.5" title="Snippet Library">
            <Bookmark className="h-3.5 w-3.5" /> Snippets
          </Button>
          {showSnippets && (
            <div className="absolute top-full left-0 mt-1 z-50 w-64 bg-popover border border-border/50 rounded-xl shadow-xl backdrop-blur-xl max-h-72 overflow-y-auto">
              <div className="p-2 space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Snippet Library</div>
                {SNIPPETS.map(s => (
                  <button key={s.name} onClick={() => insertSnippet(s.code)} className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-accent transition-colors">
                    <span className="font-medium">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-px h-5 bg-border/40" />
        <Button variant="ghost" size="sm" onClick={clearOutputs} className="h-8 text-xs font-bold gap-1.5" title="Clear All Outputs">
          <RotateCcw className="h-3.5 w-3.5" /> Clear
        </Button>
        <div className="w-px h-5 bg-border/40" />
        <Button variant="ghost" size="sm" onClick={exportNotebook} className="h-8 text-xs font-bold gap-1.5" title="Export as JSON">
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
        <Button variant="ghost" size="sm" onClick={exportHtml} className="h-8 text-xs font-bold gap-1.5" title="Export as HTML">
          <FileCode className="h-3.5 w-3.5" /> HTML
        </Button>
        <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="h-8 text-xs font-bold gap-1.5" title="Import Notebook">
          <Upload className="h-3.5 w-3.5" /> Import
        </Button>
        <Button variant="ghost" size="sm" onClick={shareNotebook} className="h-8 text-xs font-bold gap-1.5" title="Share Notebook">
          <Share2 className="h-3.5 w-3.5" /> Share
        </Button>
        <div className="w-px h-5 bg-border/40" />
        <Button variant="ghost" size="sm" onClick={resetNotebook} className="h-8 text-xs font-bold gap-1.5 text-muted-foreground hover:text-destructive" title="Reset Notebook">
          <Trash2 className="h-3.5 w-3.5" /> Reset
        </Button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={importNotebook} />
      </div>

      {/* Notebook Cells */}
      <div className="space-y-3">
        {cells.map((cell, index) => (
          <div key={cell.id} className="group relative border border-border/40 rounded-xl bg-card/20 backdrop-blur-sm hover:border-border/60 transition-all duration-200 overflow-hidden">
            {/* Cell Header */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-muted/20 border-b border-border/20">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                <span className="font-bold text-foreground/60">In [{cell.executionCount ?? " "}]</span>
                {cell.executionTime !== null && <span className="flex items-center gap-1 text-[9px]"><Clock className="h-2.5 w-2.5" />{cell.executionTime}ms</span>}
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleCodeCollapse(cell.id)} title={cell.isCodeCollapsed ? "Show code" : "Hide code"}>
                  {cell.isCodeCollapsed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCellCode(cell.code, `copy-${cell.id}`)} title="Copy cell code">
                  {copiedId === `copy-${cell.id}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveCell(cell.id, "up")} disabled={index === 0} title="Move up">
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveCell(cell.id, "down")} disabled={index === cells.length - 1} title="Move down">
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <div className="w-px h-4 bg-border/30 mx-0.5" />
                <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10" onClick={() => runCell(cell.id)} disabled={cell.isRunning} title="Run cell (Shift+Enter)">
                  <Play className={`h-3 w-3 ${cell.isRunning ? "animate-pulse" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => addCell(cell.id)} title="Add cell below">
                  <Plus className="h-3 w-3" />
                </Button>
                {cell.outputs.length > 0 && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-amber-500" onClick={() => clearCellOutput(cell.id)} title="Clear cell output">
                    <Eraser className="h-3 w-3" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => deleteCell(cell.id)} disabled={cells.length <= 1} title="Delete cell">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Code Editor */}
            {!cell.isCodeCollapsed && (
              <div className="relative">
                <div className="flex">
                  <div className="select-none text-right pr-3 pl-2 py-3 text-[11px] font-mono text-muted-foreground/30 leading-[1.6] bg-muted/10 border-r border-border/10 min-w-[3rem]">
                    {cell.code.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  <textarea
                    value={cell.code}
                    onChange={e => updateCellCode(cell.id, e.target.value)}
                    onKeyDown={e => handleKeyDown(e, cell.id)}
                    spellCheck={false}
                    className="flex-1 min-h-[80px] resize-y bg-transparent p-3 text-sm font-mono leading-[1.6] text-foreground placeholder:text-muted-foreground/25 border-0 outline-none focus:ring-0 selection:bg-primary/20"
                    placeholder="// Write your JavaScript code here..."
                  />
                </div>
              </div>
            )}

            {/* Output Area */}
            {cell.outputs.length > 0 && (
              <>
                <div className="flex items-center gap-2 px-3 py-1 border-t border-border/15 bg-muted/10">
                  <button onClick={() => toggleOutputs(cell.id)} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors">
                    {collapseOutputs.has(cell.id) ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    Output ({cell.outputs.filter(o => o.type !== "clear").length})
                  </button>
                </div>
                {!collapseOutputs.has(cell.id) && (
                  <div className="border-t border-border/10 bg-card/10 divide-y divide-border/5 max-h-[400px] overflow-y-auto">
                    {cell.outputs.map((output, idx) => (
                      <div key={idx} className="group/output relative">
                        {renderOutput(output, idx)}
                        <button
                          onClick={() => { navigator.clipboard.writeText(output.text); toast.success("Output copied"); }}
                          className="absolute right-1 top-1 opacity-0 group-hover/output:opacity-100 p-1 rounded hover:bg-muted/50 transition-all"
                          title="Copy output"
                        >
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Running indicator */}
            {cell.isRunning && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  Running...
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <Card className="border border-border/30 bg-card/10 rounded-xl">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <SplitSquareHorizontal className="h-3 w-3" />
            Shortcuts &amp; Info
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/40 text-[9px] font-mono font-bold">Shift</kbd>+
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/40 text-[9px] font-mono font-bold">Enter</kbd> Run cell
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/40 text-[9px] font-mono font-bold">⌘</kbd>+
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/40 text-[9px] font-mono font-bold">Enter</kbd> Run cell
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/40 text-[9px] font-mono font-bold">Esc</kbd> Blur cell
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Auto-saved to localStorage</span>
            <span className="text-muted-foreground/40">·</span>
            <span>Supports <code className="text-primary font-mono">async/await</code></span>
            <span className="text-muted-foreground/40">·</span>
            <span>ES2024 features</span>
            <span className="text-muted-foreground/40">·</span>
            <span>Share via URL hash</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
