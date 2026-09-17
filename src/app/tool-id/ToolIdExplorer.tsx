"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
    Search, 
    Copy, 
    Check, 
    ExternalLink, 
    Code2, 
    Layers, 
    Eye, 
    Sliders,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export interface ToolSummary {
    id: string;
    name: string;
    route: string;
    category: string;
    description?: string;
}

interface ToolIdExplorerProps {
    initialTools: ToolSummary[];
    categories: { slug: string; name: string }[];
}

export default function ToolIdExplorer({ initialTools, categories }: ToolIdExplorerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedToolId, setSelectedToolId] = useState<string>(initialTools[0]?.id || "webp-to-jpg-converter");
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [embedTheme, setEmbedTheme] = useState<"dark" | "light">("dark");
    const [embedAccent, setEmbedAccent] = useState<"blue" | "purple" | "emerald" | "orange">("blue");
    const [activeTab, setActiveTab] = useState<"code" | "preview">("code");

    // Filtered tools
    const filteredTools = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        return initialTools.filter((t) => {
            const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
            const matchesQuery = 
                !query || 
                t.id.toLowerCase().includes(query) || 
                t.name.toLowerCase().includes(query) || 
                (t.description && t.description.toLowerCase().includes(query));
            return matchesCategory && matchesQuery;
        });
    }, [initialTools, searchQuery, selectedCategory]);

    const activeTool = useMemo(() => {
        return initialTools.find((t) => t.id === selectedToolId) || initialTools[0];
    }, [initialTools, selectedToolId]);

    const embedUrl = `https://sopkit.github.io/embed-tool/?id=${activeTool?.id || ""}&theme=${embedTheme}&accent=${embedAccent}`;
    const iframeCode = `<iframe src="${embedUrl}" width="100%" height="650" frameborder="0" loading="lazy" style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); width: 100%;"></iframe>`;

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success(`Copied ${field} to clipboard!`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Search & Filter Bar */}
            <div className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by tool ID, name, or keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 rounded-xl bg-background/80 text-sm border-border/60"
                            aria-label="Filter tool IDs"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium w-full md:w-auto justify-end">
                        <span className="font-bold text-foreground">{filteredTools.length}</span> of {initialTools.length} tools available
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                            selectedCategory === "all"
                                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                                selectedCategory === cat.slug
                                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split Screen Explorer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Tool Directory List */}
                <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
                    {filteredTools.length === 0 ? (
                        <div className="text-center py-12 bg-card/20 rounded-2xl border border-dashed border-border/60 p-6 space-y-2">
                            <p className="font-semibold text-foreground">No tools match your query</p>
                            <p className="text-xs text-muted-foreground">Try adjusting your keywords or selecting another category.</p>
                        </div>
                    ) : (
                        filteredTools.map((tool) => {
                            const isSelected = tool.id === activeTool?.id;
                            return (
                                <div
                                    key={tool.id}
                                    onClick={() => setSelectedToolId(tool.id)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                                        isSelected
                                            ? "bg-primary/10 border-primary/40 shadow-sm"
                                            : "bg-card/25 border-border/40 hover:border-border hover:bg-card/40"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-foreground truncate">{tool.name}</h3>
                                                <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                                                    {tool.category}
                                                </Badge>
                                            </div>
                                            <p className="text-xs font-mono text-primary mt-1 truncate">id: {tool.id}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyToClipboard(tool.id, tool.id);
                                            }}
                                            title="Copy tool ID"
                                            className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                        >
                                            {copiedField === tool.id ? (
                                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Right: Selected Tool Inspector */}
                <div className="lg:col-span-7 sticky top-24 space-y-6">
                    {activeTool ? (
                        <Card className="p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md shadow-md space-y-6">
                            {/* Header Info */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-xl font-bold text-foreground tracking-tight">{activeTool.name}</h2>
                                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-mono font-bold">
                                            {activeTool.id}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{activeTool.description}</p>
                                </div>
                                <Button asChild size="sm" variant="outline" className="rounded-xl shrink-0 gap-1.5 text-xs font-semibold">
                                    <Link href={activeTool.route} target="_blank">
                                        Open Tool <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Embed Configuration Controls */}
                            <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/40 text-xs">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                        <Sliders className="h-3 w-3" /> Theme
                                    </Label>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setEmbedTheme("dark")}
                                            className={`px-3 py-1 rounded-lg font-medium transition-all ${
                                                embedTheme === "dark" ? "bg-foreground text-background font-bold" : "bg-card text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            Dark
                                        </button>
                                        <button
                                            onClick={() => setEmbedTheme("light")}
                                            className={`px-3 py-1 rounded-lg font-medium transition-all ${
                                                embedTheme === "light" ? "bg-foreground text-background font-bold" : "bg-card text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            Light
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground">Accent Color</Label>
                                    <div className="flex gap-1.5">
                                        {(["blue", "purple", "emerald", "orange"] as const).map((accent) => (
                                            <button
                                                key={accent}
                                                onClick={() => setEmbedAccent(accent)}
                                                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                                                    embedAccent === accent ? "bg-primary text-primary-foreground font-bold" : "bg-card text-muted-foreground hover:text-foreground"
                                                }`}
                                            >
                                                {accent}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tabs: Code vs Live Preview */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setActiveTab("code")}
                                            className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-all ${
                                                activeTab === "code"
                                                    ? "border-primary text-foreground"
                                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            <Code2 className="h-3.5 w-3.5" /> Embed Code
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("preview")}
                                            className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-all ${
                                                activeTab === "preview"
                                                    ? "border-primary text-foreground"
                                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            <Eye className="h-3.5 w-3.5" /> Live Preview
                                        </button>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(iframeCode, "iframe embed code")}
                                        className="h-7 text-xs font-bold gap-1 text-primary hover:text-primary/80"
                                    >
                                        {copiedField === "iframe embed code" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                        Copy Snippet
                                    </Button>
                                </div>

                                {activeTab === "code" ? (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <pre className="p-4 rounded-xl bg-background/90 border border-border/60 text-xs font-mono overflow-x-auto text-foreground/90 whitespace-pre-wrap break-all leading-relaxed">
                                                {iframeCode}
                                            </pre>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-muted-foreground">Direct Embed URL</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    readOnly
                                                    value={embedUrl}
                                                    className="font-mono text-xs h-9 rounded-xl bg-background/60"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard(embedUrl, "embed URL")}
                                                    className="rounded-xl h-9 shrink-0 gap-1 text-xs"
                                                >
                                                    {copiedField === "embed URL" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full rounded-2xl overflow-hidden border border-border/60 bg-background/90 shadow-inner">
                                        <iframe
                                            src={embedUrl}
                                            title={activeTool.name}
                                            className="w-full h-[550px] border-0"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                            </div>
                        </Card>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
