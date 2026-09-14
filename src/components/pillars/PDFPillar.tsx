"use client";

import React from "react";
import Link from "next/link";
import { 
    FileText, 
    Merge, 
    Scissors, 
    Zap, 
    Lock, 
    Unlock, 
    FileImage, 
    FileCode, 
    Type, 
    Database,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pdfTools = [
    {
        title: "Conversion Suite",
        description: "Transform your documents to and from PDF without losing formatting.",
        tools: [
            { name: "Image to PDF", icon: FileImage, href: "/image-to-pdf", desc: "Convert JPG, PNG, WEBP to PDF" },
            { name: "PDF to Image", icon: FileImage, href: "/pdf-to-image", desc: "Extract pages as JPG or PNG" },
            { name: "Word to PDF", icon: FileText, href: "/word-to-pdf", desc: "High-quality DOCX conversion" },
            { name: "PDF to Word", icon: FileText, href: "/pdf-to-word", desc: "Edit PDFs in Microsoft Word" },
            { name: "HTML to PDF", icon: FileCode, href: "/html-to-pdf", desc: "Convert web snippets to PDF" },
        ]
    },
    {
        title: "Optimization & Editing",
        description: "Refine your PDF files for better sharing and professional presentation.",
        tools: [
            { name: "Compress PDF", icon: Zap, href: "/pdf-compressor", desc: "Reduce file size without quality loss" },
            { name: "PDF Editor", icon: Type, href: "/pdf-editor", desc: "Add text and annotations to pages" },
            { name: "Page Numbers", icon: Database, href: "/pdf-page-numbers", desc: "Add custom pagination to documents" },
            { name: "PDF Watermark", icon: CheckCircle2, href: "/pdf-watermark", desc: "Add logos or text watermarks" },
            { name: "Metadata Editor", icon: FileText, href: "/pdf-metadata-editor", desc: "Edit Title, Author, and Keywords" },
        ]
    },
    {
        title: "Structure & Security",
        description: "Manage document layout and protect sensitive information.",
        tools: [
            { name: "Merge PDF", icon: Merge, href: "/pdf-merger", desc: "Combine multiple PDFs into one" },
            { name: "Split PDF", icon: Scissors, href: "/pdf-splitter", desc: "Extract specific pages from PDF" },
            { name: "Rotate PDF", icon: ArrowRight, href: "/pdf-rotation", desc: "Fix orientation of individual pages" },
            { name: "Protect PDF", icon: Lock, href: "/pdf-protect", desc: "Secure documents with AES encryption" },
            { name: "Unlock PDF", icon: Unlock, href: "/pdf-unlocker", desc: "Remove restrictions from protected files" },
        ]
    }
];

export default function PDFPillar() {
    return (
        <div className="space-y-24">
            {/* Tool Grid Section */}
            <div className="grid grid-cols-1 gap-14">
                {pdfTools.map((group, i) => (
                    <div key={i} className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground uppercase">{group.title}</h2>
                            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{group.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {group.tools.map((tool, j) => (
                                <Link key={j} href={tool.href} className="group no-underline">
                                    <Card className="rounded-2xl border border-border/70 dark:border-border/40 bg-card/60 dark:bg-card/40 hover:bg-card/95 dark:hover:bg-card/75 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-[0_16px_36px_rgba(37,99,235,0.12)] relative overflow-hidden">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="p-3 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-xl transition-all duration-300 shadow-sm">
                                                    <tool.icon className="h-5 w-5" />
                                                </div>
                                                <Badge variant="outline" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity uppercase text-[10px] tracking-wider font-bold border-primary/30 text-primary bg-primary/5">Launch</Badge>
                                            </div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{tool.name}</h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tool.desc}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Deep Content Section for SEO */}
            <section className="max-w-none space-y-12">
                <div className="bg-card/60 dark:bg-card/30 p-8 sm:p-12 rounded-3xl border border-border/60 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-8 text-foreground uppercase">Professional PDF Management Without the Premium Price Tag</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 text-muted-foreground text-sm sm:text-base leading-relaxed">
                        <div className="space-y-4">
                            <p>
                                Managing PDF files shouldn&apos;t require expensive subscriptions or heavy software installations. At SopKit, we&apos;ve built a comprehensive suite of PDF utilities that bring enterprise-grade functionality directly to your browser. Whether you need to merge legal documents, compress portfolios for email, or secure sensitive reports, our tools deliver precision results in seconds.
                            </p>
                            <p>
                                Our architecture is built on the principle of <strong className="text-foreground">Local-First Processing</strong>. Unlike traditional online PDF editors that upload your private documents to a remote server, SopKit uses advanced JavaScript and WebAssembly to process your files right on your computer. Your data never leaves your device, providing the highest possible level of security and privacy.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p>
                                Why choose SopKit over SmallPDF or iLovePDF? The answer is simple: <strong className="text-foreground">Zero Friction</strong>. We have eliminated signups, daily usage limits, and watermarks. Our mission is to provide professional-grade tools that are genuinely free, fast, and accessible to everyone — from students and researchers to developers and business owners.
                            </p>
                            <ul className="space-y-3 pt-2">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span><strong className="text-foreground">Browser-Side Encryption:</strong> AES-256 protection processed locally.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span><strong className="text-foreground">High-Fidelity Conversion:</strong> Maintain fonts, layers, and formatting.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span><strong className="text-foreground">Batch Processing:</strong> Handle multiple files at once without a Pro account.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-card/40 border border-border/50 space-y-3">
                        <h3 className="text-lg font-bold text-foreground">Secure by Design</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Every tool in our PDF suite operates without server-side storage. Your files are processed in a secure browser sandbox, ensuring 100% data sovereignty.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/40 border border-border/50 space-y-3">
                        <h3 className="text-lg font-bold text-foreground">Format Integrity</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Our conversion engines are optimized to respect complex layouts, tables, and embedded fonts, ensuring your Word or Image conversions look professional.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/40 border border-border/50 space-y-3">
                        <h3 className="text-lg font-bold text-foreground">Mobile First</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">No app needed. Access the full power of our PDF suite on your iPhone, Android, or tablet with a fully responsive, high-performance interface.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
