import React from "react";
import { ShieldCheck, Cpu, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SITE_CONFIG } from "@/constants/config";

export function HomeSEOContent() {
  const capabilities = [
    {
      icon: ShieldCheck,
      title: "Local-First Sandbox Processing",
      description:
        "Media, documents, and code are processed entirely inside your local browser thread using WebAssembly and Canvas APIs. Sensitive personal files and credentials never leave your machine.",
    },
    {
      icon: Cpu,
      title: "Zero Server Queues or Upload Delay",
      description:
        "By offloading computational work to your device's hardware, conversions happen without network latency, upload limits, or cloud throttling.",
    },
    {
      icon: Lock,
      title: "Zero Account Authentication",
      description:
        "Access all utilities immediately without signing up, verifying an email, or encountering paywalls. Direct utility access whenever you need it.",
    },
    {
      icon: Sparkles,
      title: "Open Embedding Architecture",
      description:
        "Easily embed interactive utilities directly into documentation, blogs, or intranets with dedicated lightweight iframe endpoints.",
    },
  ];

  const domains = [
    "Image Compression & Conversion (WebP, PNG, JPEG, AVIF)",
    "PDF Manipulation (Merge, Split, Protect, Compress)",
    "Developer Utilities (JSON Formatter, Base64, Regex, Hash)",
    "Text & Markdown Formatting and Case Transformers",
    "Audio & Video Tools with WebCodecs & FFmpeg Wasm",
    "Financial, Math, and Unit Converters & Calculators",
  ];

  return (
    <Section padding="loose" className="border-t border-border/60 bg-surface/50">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Search Intent & Architecture Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Architecture & Trust
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground leading-tight">
              A comprehensive toolkit built for speed, transparency, and privacy.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              SopKit brings together over {SITE_CONFIG.toolCountString} free browser utilities designed for
              developers, creators, students, and professionals. Unlike conventional web converters that upload
              your private files to third-party cloud servers, SopKit uses modern WebAssembly, Canvas, and
              Web Worker APIs to execute transformations directly on your device.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div key={cap.title} className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-surface-muted dark:bg-card flex items-center justify-center text-foreground border border-border">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {cap.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Technical Domain Coverage Card */}
          <div className="lg:col-span-5 p-8 rounded-2xl bg-surface-muted/60 dark:bg-card/60 border border-border backdrop-blur-sm space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Tool Directory
              </span>
              <h3 className="text-xl font-serif font-bold text-foreground mt-1">
                Supported Workflows
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Comprehensive toolsets across core digital tasks.
              </p>
            </div>

            <ul className="space-y-3.5 pt-2">
              {domains.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-xl bg-background border border-border text-xs text-muted-foreground leading-relaxed">
              <p className="font-mono text-[11px] text-foreground mb-1 font-semibold">
                Open Web Standards
              </p>
              Built entirely on open web primitives. No telemetry on file contents, no server logs of private inputs, and no intrusive tracking cookies.
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
