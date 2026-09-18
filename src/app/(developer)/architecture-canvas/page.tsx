import type { Metadata } from "next";
import ArchitectureCanvas from "@/components/features/ArchitectureCanvas";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { ChevronRight, Layers, Cpu, Share2, Workflow } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Architecture Canvas Online — Interactive System Design Visualizer",
  description: "Design, simulate, and export modern cloud architectures and microservices. Drag-and-drop nodes, estimate end-to-end latency, and export to Mermaid diagrams.",
  alternates: {
    canonical: "https://sopkit.space/architecture-canvas/",
  },
  openGraph: {
    title: "Architecture Canvas — Interactive System Design Tool",
    description: "Visual cloud system design visualizer with real-time latency simulation and Mermaid.js export.",
    url: "https://sopkit.space/architecture-canvas/",
    type: "website",
  },
};

export default function ArchitectureCanvasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SopKit Architecture Canvas",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Interactive browser-based system architecture diagrammer and flow simulator for engineering teams and architects.",
    url: "https://sopkit.space/architecture-canvas/",
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
          <span className="text-foreground font-medium">Architecture Canvas</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Workflow className="w-3.5 h-3.5" /> Interactive System Designer
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            System Architecture Canvas
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Model distributed microservices, edge workers, caches, and databases in seconds. Simulate dataflow paths, calculate hop latencies, and export directly to Mermaid.js diagrams.
          </p>
        </div>

        {/* Interactive Canvas */}
        <ArchitectureCanvas />

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Production Presets</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Instantly explore architectural patterns for Serverless Edge deployments, CQRS E-Commerce microservices, and Real-time WebSocket backplanes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Live Flow Simulation</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Simulate traffic flows and observe data traveling across edge gateways, caches, and database clusters with theoretical hop latency calculations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
              <Share2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Mermaid.js Export</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Export your visual architecture blueprint into standard Markdown Mermaid diagram syntax for GitHub READMEs, RFCs, and documentation.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
