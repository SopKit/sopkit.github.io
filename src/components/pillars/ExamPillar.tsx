"use client";

import React from "react";
import Link from "next/link";
import { 
    FileImage, 
    User, 
    FileText, 
    FileCheck, 
    Scale, 
    Image as ImageIcon,
    Scissors,
    ArrowRightLeft,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const examTools = [
    {
        title: "Official Exam Resizers",
        description: "Resize photos and signatures to match exact guidelines for government and entrance exams.",
        tools: [
            { name: "UPSC Photo Resizer", icon: User, href: "/upsc-photo-resizer", desc: "350x350 pixels, under 300KB constraint" },
            { name: "SSC Photo Resizer", icon: User, href: "/ssc-photo-resizer", desc: "3.5 x 4.5 cm (350x450px), 20KB-50KB constraint" },
            { name: "NEET Photo Resizer", icon: FileImage, href: "/neet-photo-resizer", desc: "NTA NEET passport and 4x6 postcard resizer" },
            { name: "JEE Photo Resizer", icon: FileImage, href: "/jee-photo-resizer", desc: "JEE Main/Advanced photo & signature resizer" },
            { name: "CUET Photo Resizer", icon: FileImage, href: "/cuet-photo-resizer", desc: "NTA CUET application photo and signature dimensions" },
            { name: "Railway Exam Resizer", icon: User, href: "/railway-exam-photo-resizer", desc: "RRB/RRC photo and signature dimension resizer" },
        ]
    },
    {
        title: "Size & Format Compressors",
        description: "Compress images and PDF documents to fit within strict portal upload limits.",
        tools: [
            { name: "Signature Resizer Under 20KB", icon: Scissors, href: "/signature-resizer-under-20kb", desc: "Keep signatures readable and under 20KB" },
            { name: "Photo Compressor Under 50KB", icon: Scale, href: "/photo-compressor-under-50kb", desc: "Shrink passport photo size strictly under 50KB" },
            { name: "PDF Compressor Under 200KB", icon: FileText, href: "/pdf-compressor-under-200kb", desc: "Compress PDF certificates under 200KB" },
            { name: "JPG to PDF for Exam Forms", icon: ArrowRightLeft, href: "/jpg-to-pdf-exam-forms", desc: "Merge images into single PDF for portals" },
        ]
    },
    {
        title: "Photo Tools & Checkers",
        description: "Verify your files and create print-ready standard document files.",
        tools: [
            { name: "Passport Photo Maker", icon: ImageIcon, href: "/passport-photo-maker", desc: "Create printable standard sheets (2x2 inch, 3.5x4.5cm)" },
            { name: "Form Image Size Checker", icon: FileCheck, href: "/form-image-size-checker", desc: "Verify dimensions & size before submitting" },
        ]
    }
];

export default function ExamPillar() {
    return (
        <div className="space-y-24">
            {/* Tool Grid Section */}
            <div className="grid grid-cols-1 gap-14">
                {examTools.map((group, i) => (
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

            {/* Deep Content Section for SEO/GEO */}
            <section className="max-w-none space-y-12">
                <div className="bg-card/60 dark:bg-card/30 p-8 sm:p-12 rounded-3xl border border-border/60 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-8 text-foreground uppercase">Official Exam Image Specifications & Portal Requirements</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 text-muted-foreground text-sm sm:text-base leading-relaxed">
                        <div className="space-y-4">
                            <p>
                                According to official portal guidelines (including UPSC, SSC, NEET-UG, JEE-Main, and RRB), government portals enforce rigid technical constraints on biometric uploads. Our laboratory-tested algorithms ensure that every file meets the <strong className="text-foreground">300 DPI resolution</strong> and specific aspect ratios required for automated facial recognition systems.
                            </p>
                            <p>
                                <strong className="text-foreground">Security & Privacy Guarantee:</strong> SopKit processes <strong className="text-foreground">100% of image data locally</strong> within your browser instance. By utilizing Client-Side JavaScript and HTML5 Canvas, we eliminate the risk of server-side data breaches. Local processing ensures your sensitive identity documents never traverse external cloud networks.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p>
                                Experts often recommend preparing images with a &quot;White Background and 80% Face Coverage.&quot; Our tools provide a precision crop-to-size interface to achieve these benchmarks instantly.
                            </p>
                            <ul className="space-y-3 pt-2">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span><strong className="text-foreground">NTA/UPSC Standard Specs:</strong> Precision 3.5cm x 4.5cm photo and 3.5cm x 1.5cm signature outputs.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span><strong className="text-foreground">Dynamic Bitrate Compression:</strong> Target strict 20KB to 50KB limits for SSC and 10KB to 200KB for NTA.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span><strong className="text-foreground">Universal Compatibility:</strong> Verified against the standard JPEG format used across 95%+ of portals.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-card/40 border border-border/50 space-y-3">
                        <h3 className="text-lg font-bold text-foreground">NTA & UPSC Compliance Guide</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">We support the 4x6 Postcard requirement for NEET and the 350x350 pixel requirement for UPSC signatures, preventing technical rejection.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/40 border border-border/50 space-y-3">
                        <h3 className="text-lg font-bold text-foreground">Signature Integrity</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Our algorithms preserve ink stroke contrast even when compressing scanned signatures below 20KB for high acceptance.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/40 border border-border/50 space-y-3">
                        <h3 className="text-lg font-bold text-foreground">Zero-Server Policy</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">No personal identifiers or biometrics are ever sent to a server. Everything runs directly inside your browser sandbox.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
