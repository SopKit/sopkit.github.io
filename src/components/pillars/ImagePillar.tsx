"use client";

import React from "react";
import Link from "next/link";
import { 
    Maximize, 
    Zap, 
    Layers, 
    Eraser, 
    Crop, 
    Palette, 
    Type, 
    Download,
    CheckCircle2,
    Monitor
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const imageTools = [
    {
        title: "Optimization & Compression",
        description: "Speed up your website with high-performance image optimization.",
        tools: [
            { name: "Image Compressor", icon: Zap, href: "/image-compressor", desc: "Reduce size with zero quality loss" },
            { name: "Image Resizer", icon: Maximize, href: "/image-resizer", desc: "Change dimensions for social media" },
            { name: "Image to WebP", icon: Monitor, href: "/image-converter", desc: "Modern format for faster loading" },
            { name: "HEIC to JPG", icon: Download, href: "/image-converter", desc: "Convert iPhone photos for Windows" },
            { name: "Image to Base64", icon: Layers, href: "/image-to-base64", desc: "Inline images into CSS or HTML" },
        ]
    },
    {
        title: "Creative Editing",
        description: "Professional tools for quick creative adjustments and branding.",
        tools: [
            { name: "Background Remover", icon: Eraser, href: "/background-remover", desc: "AI-powered subject isolation" },
            { name: "Circular Crop", icon: Crop, href: "/circular-image-crop", desc: "Perfect profile pictures for social" },
            { name: "Color Picker", icon: Palette, href: "/image-color-picker", desc: "Extract HEX/RGB from any image" },
            { name: "Photo Enhancer", icon: Zap, href: "/photo-enhancer", desc: "Sharpen and clarify blurry shots" },
            { name: "Watermark Adder", icon: Type, href: "/image-watermark", desc: "Protect your creative work" },
        ]
    },
    {
        title: "Format Conversion",
        description: "Universal compatibility for all your digital assets.",
        tools: [
            { name: "JPG to PNG", icon: Download, href: "/image-converter", desc: "Lossless transparent conversion" },
            { name: "SVG to PNG", icon: Download, href: "/image-converter", desc: "Rasterize vector files for web" },
            { name: "ICO Generator", icon: Download, href: "/favicon-generator", desc: "Create favicons from any logo" },
            { name: "GIF Maker", icon: Download, href: "/gif-generator", desc: "Convert video or images to animation" },
            { name: "WebP to JPG", icon: Download, href: "/image-converter", desc: "Legacy format compatibility" },
        ]
    }
];

export default function ImagePillar() {
    return (
        <div className="space-y-24">
            {/* Tool Grid Section */}
            <div className="grid grid-cols-1 gap-14">
                {imageTools.map((group, i) => (
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
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-8 text-foreground uppercase">The Fast, Private Way to Edit and Optimize Images</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 text-muted-foreground text-sm sm:text-base leading-relaxed">
                        <div className="space-y-4">
                            <p>
                                High-quality images shouldn&apos;t slow down your workflow or your website. Our suite of free online image tools is designed for creators, developers, and social media managers who need professional results without the bloat of traditional photo editing software. From background removal to advanced WebP compression, we handle it all.
                            </p>
                            <p>
                                <strong className="text-foreground">Privacy is our Core Feature.</strong> Most online editors upload your personal photos to their servers. SopKit processes your images <strong className="text-foreground">locally in your browser</strong>. Your data never leaves your device, ensuring that sensitive documents, personal photos, and proprietary designs remain 100% private.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p>
                                Whether you&apos;re optimizing a landing page for Core Web Vitals or preparing photos for an Instagram campaign, our tools are built for speed and precision. No signups, no &quot;Pro&quot; subscriptions, and no hidden watermarks. Just pure, functional tools that work when you need them.
                            </p>
                            <ul className="space-y-3 pt-2">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span><strong className="text-foreground">Instant Processing:</strong> Zero server latency. Results in milliseconds.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span><strong className="text-foreground">Lossless Optimization:</strong> Maintain crisp details while reducing size.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span><strong className="text-foreground">Universal Formats:</strong> Support for JPG, PNG, WEBP, HEIC, and SVG.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-card/40 border border-border/50 space-y-3">
                        <h3 className="text-lg font-bold text-foreground">SEO Optimized</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Our compression tools are fine-tuned to help you hit those Green Lighthouse scores by stripping unnecessary metadata and using modern formats.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/40 border border-border/50 space-y-3">
                        <h3 className="text-lg font-bold text-foreground">Developer Ready</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Convert images to Base64 strings for direct CSS inlining, or batch convert entire directories into lightweight WebP graphics in seconds.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/40 border border-border/50 space-y-3">
                        <h3 className="text-lg font-bold text-foreground">Client-Side AI</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">We leverage browser-based WebAssembly and WebGL acceleration to run computer vision models locally on your GPU without cloud costs.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
