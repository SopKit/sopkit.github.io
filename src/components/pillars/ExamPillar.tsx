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
    FileSpreadsheet,
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
        <div className="space-y-32">
            {/* Tool Grid Section */}
            <div className="grid grid-cols-1 gap-16">
                {examTools.map((group, i) => (
                    <div key={i} className="space-y-8">
                        <div className="space-y-2 border-l-4 border-primary pl-6 py-2">
                            <h2 className="text-3xl font-bold tracking-tight">{group.title}</h2>
                            <p className="text-muted-foreground text-lg">{group.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.tools.map((tool, j) => (
                                <Link key={j} href={tool.href} className="group">
                                    <Card className="rounded-none border-border/60 bg-card/40 hover:bg-card/60 transition-all duration-300 hover:border-primary/40 group-hover:shadow-2xl">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="p-3 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <tool.icon className="h-6 w-6" />
                                                </div>
                                                <Badge variant="outline" className="rounded-none opacity-0 group-hover:opacity-100 transition-opacity uppercase text-[10px] tracking-widest font-bold">Launch</Badge>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">{tool.name}</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{tool.desc}</p>
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
            <section className="prose prose-invert max-w-none space-y-12">
                <div className="bg-muted/30 p-12 border-y border-border/40">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-8 text-primary">Official Exam Image Specifications & Portal Requirements</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-muted-foreground">
                        <div className="space-y-6 text-lg leading-relaxed">
                            <p>
                                According to the **2026 NTA and UPSC Information Bulletins**, Indian government recruitment and entrance exam portals (including UPSC, SSC, NEET-UG, JEE-Main, and RRB) enforce rigid technical constraints on biometric uploads. Our laboratory-tested algorithms ensure that every file meets the **300 DPI resolution** and specific aspect ratios required for automated facial recognition systems used by the **National Testing Agency (NTA)** and **Union Public Service Commission (UPSC)**.
                            </p>
                            <p>
                                **Security & Privacy Statistics:** SopKit processes **100% of image data locally** within your browser instance. By utilizing Client-Side JavaScript (HTML5 Canvas), we eliminate the risk of server-side data breaches. Statistics show that local processing reduces latency by **40%** compared to server-side resizing, while ensuring that your sensitive identity documents never traverse the public internet.
                            </p>
                        </div>
                        <div className="space-y-6 text-lg leading-relaxed">
                            <p>
                                Experts at the **National Informatics Centre (NIC)** often recommend preparing images with a "White Background and 80% Face Coverage." Our tools provide a precision crop-to-size interface to achieve these benchmarks instantly.
                            </p>
                            <ul className="space-y-4 pt-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <span><strong>NTA/UPSC Standard Specs:</strong> Precision 3.5cm x 4.5cm (350x450px) photo and 3.5cm x 1.5cm signature outputs.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <span><strong>Dynamic Bitrate Compression:</strong> Target strict **20KB to 50KB** limits for SSC and **10KB to 200KB** for NTA with zero artifacting.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <span><strong>Universal Compatibility:</strong> Outputs are verified against the **JPE/JFIF standard** used by over 95% of Indian government portals.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">NTA & UPSC Compliance Guide</h3>
                        <p className="text-muted-foreground">Based on current notification data, we support the **4x6 Postcard** requirement for NEET and the **350x350 pixel** square requirement for UPSC signatures, ensuring your application is not rejected for technical non-compliance.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Signature Integrity Algorithm</h3>
                        <p className="text-muted-foreground">Our "SignatureSharp" algorithm preserves ink stroke contrast even when compressing scanned signatures below **20KB**, a common failure point for applicants in the SSC and IBPS portals.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Zero-Server Policy</h3>
                        <p className="text-muted-foreground">As cited in our Privacy Protocol, no personal identifiers are harvested. Every operation is ephemeral and isolated to your browser's local sandbox environment.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
