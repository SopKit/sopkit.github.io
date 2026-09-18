import type { Metadata } from "next";
import DevSpeedChallenge from "@/components/features/DevSpeedChallenge";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { ChevronRight, Zap, Trophy, Target, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Free DevSpeed Online — Developer Code Typing Speed Benchmark",
  description: "Test and benchmark your coding typing speed with real syntax in TypeScript, Python, Rust, Go, and SQL. Measure WPM, CPM, accuracy, and bracket precision.",
  alternates: {
    canonical: "https://sopkit.space/dev-speed/",
  },
  openGraph: {
    title: "DevSpeed — Developer Code Typing Speed Test",
    description: "Benchmark your coding speed with real code snippets in TypeScript, Rust, Python, Go, and SQL.",
    url: "https://sopkit.space/dev-speed/",
    type: "website",
  },
};

export default function DevSpeedPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DevSpeed Code Typing Benchmark",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Interactive typing speed test and symbol benchmark designed specifically for programmers across modern software engineering languages.",
    url: "https://sopkit.space/dev-speed/",
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href="/developer-tools" className="hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-foreground font-medium">DevSpeed</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> Real-time Developer Benchmark
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Developer Code Typing Speed Test
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Standard typing tests don't reflect real software engineering. Benchmark your muscle memory across brackets, arrow functions, SQL clauses, and decorators.
          </p>
        </div>

        {/* Interactive Game Component */}
        <DevSpeedChallenge />

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Syntax & Symbol Precision</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Measures how accurately you type closing braces, generic parameters, arrows, colons, and semicolons under time pressure.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Multi-Language Workflows</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Practice authentic patterns from production codebases in TypeScript, Python, Rust, Go, and modern SQL.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">100% Client-Side Privacy</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Every keystroke is evaluated locally in your browser memory. Zero analytics tracking of your typing inputs or keystroke timings.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
