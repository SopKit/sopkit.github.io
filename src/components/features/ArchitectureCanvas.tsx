"use client";

import * as React from "react";
import {
  Layers, Plus, Trash2, ArrowRight, Share2, Download, Copy,
  Check, Play, Activity, Server, Database, Globe, Cpu, Radio, Shield, HardDrive
} from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";

export interface ArchNode {
  id: string;
  name: string;
  type: "client" | "edge" | "gateway" | "service" | "cache" | "database" | "queue";
  latencyMs: number;
  x: number;
  y: number;
}

export interface ArchEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

const PRESET_TEMPLATES = [
  {
    name: "Serverless Edge Stack",
    desc: "Next.js on Edge with KV Cache and D1 / Neon Postgres",
    nodes: [
      { id: "client", name: "Web Browser", type: "client", latencyMs: 5, x: 40, y: 150 },
      { id: "edge", name: "Cloudflare Worker", type: "edge", latencyMs: 12, x: 260, y: 150 },
      { id: "cache", name: "KV Edge Cache", type: "cache", latencyMs: 8, x: 480, y: 80 },
      { id: "db", name: "PostgreSQL Database", type: "database", latencyMs: 35, x: 480, y: 220 },
    ],
    edges: [
      { id: "e1", from: "client", to: "edge", label: "HTTPS / HTTP3" },
      { id: "e2", from: "edge", to: "cache", label: "Cache Read/Write" },
      { id: "e3", from: "edge", to: "db", label: "Pooled SQL" },
    ],
  },
  {
    name: "Microservices E-Commerce",
    desc: "Event-driven system with API Gateway, Kafka, and Redis",
    nodes: [
      { id: "client", name: "React Frontend", type: "client", latencyMs: 5, x: 30, y: 160 },
      { id: "gw", name: "Kong API Gateway", type: "gateway", latencyMs: 10, x: 220, y: 160 },
      { id: "auth", name: "Auth Service", type: "service", latencyMs: 18, x: 420, y: 60 },
      { id: "orders", name: "Order Service", type: "service", latencyMs: 22, x: 420, y: 260 },
      { id: "redis", name: "Redis Session Cache", type: "cache", latencyMs: 4, x: 620, y: 60 },
      { id: "kafka", name: "Kafka Event Bus", type: "queue", latencyMs: 15, x: 620, y: 260 },
      { id: "db", name: "Primary Postgres DB", type: "database", latencyMs: 30, x: 800, y: 260 },
    ],
    edges: [
      { id: "e1", from: "client", to: "gw", label: "REST / GraphQL" },
      { id: "e2", from: "gw", to: "auth", label: "gRPC" },
      { id: "e3", from: "gw", to: "orders", label: "gRPC" },
      { id: "e4", from: "auth", to: "redis", label: "JWT Cache" },
      { id: "e5", from: "orders", to: "kafka", label: "OrderCreated" },
      { id: "e6", from: "kafka", to: "db", label: "Async Persistence" },
    ],
  },
  {
    name: "Real-Time Chat & Collab",
    desc: "WebSocket cluster with Redis Pub/Sub backplane",
    nodes: [
      { id: "client", name: "Mobile & Web Clients", type: "client", latencyMs: 5, x: 40, y: 140 },
      { id: "lb", name: "Envoy Load Balancer", type: "gateway", latencyMs: 8, x: 250, y: 140 },
      { id: "ws1", name: "WS Node Server 1", type: "service", latencyMs: 15, x: 460, y: 70 },
      { id: "ws2", name: "WS Node Server 2", type: "service", latencyMs: 15, x: 460, y: 210 },
      { id: "pubsub", name: "Redis Pub/Sub Cluster", type: "cache", latencyMs: 6, x: 680, y: 140 },
    ],
    edges: [
      { id: "e1", from: "client", to: "lb", label: "WSS / TLS" },
      { id: "e2", from: "lb", to: "ws1", label: "Sticky Session" },
      { id: "e3", from: "lb", to: "ws2", label: "Sticky Session" },
      { id: "e4", from: "ws1", to: "pubsub", label: "Message Fanout" },
      { id: "e5", from: "ws2", to: "pubsub", label: "Message Fanout" },
    ],
  },
];

const NODE_COLORS: Record<string, { bg: string; border: string; text: string; icon: any }> = {
  client: { bg: "bg-blue-500/10", border: "border-blue-500/40", text: "text-blue-400", icon: Globe },
  edge: { bg: "bg-amber-500/10", border: "border-amber-500/40", text: "text-amber-400", icon: Cpu },
  gateway: { bg: "bg-purple-500/10", border: "border-purple-500/40", text: "text-purple-400", icon: Shield },
  service: { bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-400", icon: Server },
  cache: { bg: "bg-cyan-500/10", border: "border-cyan-500/40", text: "text-cyan-400", icon: Activity },
  database: { bg: "bg-rose-500/10", border: "border-rose-500/40", text: "text-rose-400", icon: Database },
  queue: { bg: "bg-indigo-500/10", border: "border-indigo-500/40", text: "text-indigo-400", icon: Radio },
};

export default function ArchitectureCanvas() {
  const [nodes, setNodes] = React.useState<ArchNode[]>(PRESET_TEMPLATES[0].nodes as ArchNode[]);
  const [edges, setEdges] = React.useState<ArchEdge[]>(PRESET_TEMPLATES[0].edges);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [copiedMermaid, setCopiedMermaid] = React.useState(false);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = React.useState<string | null>(null);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Apply template
  const loadTemplate = (idx: number) => {
    const t = PRESET_TEMPLATES[idx];
    setNodes(t.nodes as ArchNode[]);
    setEdges(t.edges);
    setSelectedNodeId(null);
  };

  // Add new component
  const addNode = (type: ArchNode["type"]) => {
    const id = `node_${Date.now().toString().slice(-4)}`;
    const titles: Record<string, string> = {
      client: "New Web Client",
      edge: "Edge Worker",
      gateway: "API Gateway",
      service: "Microservice",
      cache: "In-Memory Cache",
      database: "SQL Database",
      queue: "Message Queue",
    };
    const latencies: Record<string, number> = {
      client: 5, edge: 10, gateway: 12, service: 20, cache: 4, database: 30, queue: 15,
    };

    const newNode: ArchNode = {
      id,
      name: titles[type] || "Component",
      type,
      latencyMs: latencies[type] || 15,
      x: 100 + (nodes.length * 40) % 500,
      y: 100 + (nodes.length * 30) % 250,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
  };

  // Connect node
  const connectNodes = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const exists = edges.some((e) => e.from === fromId && e.to === toId);
    if (exists) return;
    setEdges((prev) => [
      ...prev,
      { id: `e_${Date.now().toString().slice(-4)}`, from: fromId, to: toId, label: "RPC / HTTP" },
    ]);
  };

  // Delete node
  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    setDraggingNodeId(id);
    setSelectedNodeId(id);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(rect.width - 180, e.clientX - dragOffset.x));
    const newY = Math.max(10, Math.min(rect.height - 90, e.clientY - dragOffset.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: Math.round(newX), y: Math.round(newY) } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Calculate system theoretical latency
  const theoreticalLatency = React.useMemo(() => {
    if (nodes.length === 0) return 0;
    // Sum unique path hops
    const totalMs = nodes.reduce((acc, n) => acc + n.latencyMs, 0);
    return Math.round(totalMs * 0.7); // Accounting for parallel execution
  }, [nodes]);

  // Generate Mermaid Diagram
  const generateMermaid = () => {
    let code = "graph TD\n";
    nodes.forEach((n) => {
      code += `  ${n.id}["${n.name} (${n.latencyMs}ms)"]\n`;
    });
    edges.forEach((e) => {
      code += `  ${e.from} -->|${e.label || "calls"}| ${e.to}\n`;
    });
    return code;
  };

  const copyMermaid = () => {
    const code = generateMermaid();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedMermaid(true);
      setTimeout(() => setCopiedMermaid(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-xl mb-6 shadow-sm">
        {/* Templates */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Presets:
          </span>
          {PRESET_TEMPLATES.map((t, idx) => (
            <button
              key={t.name}
              onClick={() => loadTemplate(idx)}
              className="px-3 py-1.5 rounded-xl bg-muted/40 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isSimulating
                ? "bg-emerald-500 text-white shadow-sm animate-pulse"
                : "bg-muted/60 hover:bg-muted text-foreground"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            {isSimulating ? "Simulation Active" : "Simulate Flow"}
          </button>

          <button
            onClick={copyMermaid}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-xs font-medium text-foreground transition-colors"
            title="Export Mermaid Diagram syntax"
          >
            {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedMermaid ? "Copied Mermaid!" : "Copy Mermaid"}
          </button>
        </div>
      </div>

      {/* Palette & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Component Palette */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-card/50 border border-border/60 backdrop-blur-md flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-2 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Component:
          </span>
          {(["client", "edge", "gateway", "service", "cache", "database", "queue"] as const).map((type) => {
            const config = NODE_COLORS[type];
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => addNode(type)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${config.border} ${config.bg} ${config.text} text-xs font-medium hover:scale-105 transition-all`}
              >
                <Icon className="w-3.5 h-3.5" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Theoretical System Latency */}
        <div className="p-4 rounded-2xl bg-card/50 border border-border/60 backdrop-blur-md flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-primary" /> Est. End-to-End Latency
            </div>
            <div className="text-2xl font-black text-foreground mt-0.5">
              ~{theoreticalLatency} <span className="text-xs font-normal text-muted-foreground">ms</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-500 font-semibold">{nodes.length} nodes</span>
            <div className="text-[11px] text-muted-foreground">{edges.length} connections</div>
          </div>
        </div>
      </div>

      {/* Interactive Canvas Area */}
      <div
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[520px] rounded-3xl border border-border/80 bg-zinc-950/95 overflow-hidden shadow-2xl select-none"
        style={{
          backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
            </marker>
          </defs>
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const startX = fromNode.x + 85;
            const startY = fromNode.y + 35;
            const endX = toNode.x + 85;
            const endY = toNode.y + 35;

            return (
              <g key={edge.id}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#6366f1"
                  strokeWidth={isSimulating ? "2.5" : "1.8"}
                  strokeDasharray={isSimulating ? "5,5" : "none"}
                  className={isSimulating ? "animate-[dash_1s_linear_infinite]" : ""}
                  markerEnd="url(#arrow)"
                />
                {edge.label && (
                  <text
                    x={(startX + endX) / 2}
                    y={(startY + endY) / 2 - 6}
                    fill="#94a3b8"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Render draggable nodes */}
        {nodes.map((node) => {
          const config = NODE_COLORS[node.type] || NODE_COLORS.service;
          const Icon = config.icon;
          const isSelected = selectedNodeId === node.id;

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              className={`absolute w-[170px] p-3 rounded-2xl border cursor-grab active:cursor-grabbing backdrop-blur-xl transition-shadow ${config.bg} ${config.border} ${
                isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/20 scale-105 z-20" : "hover:border-primary/60 z-10"
              }`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${config.text}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{node.type}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{node.latencyMs}ms</span>
              </div>

              <div className="mt-1 font-bold text-xs text-foreground truncate">{node.name}</div>

              {/* Action buttons on select */}
              {isSelected && (
                <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Select to link</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    className="p-1 rounded-md text-red-400 hover:bg-red-950/50 transition-colors"
                    title="Remove node"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Node Inspector / Connect Helper */}
      {selectedNodeId && (
        <div className="mt-4 p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-foreground">
              Selected: <strong>{nodes.find((n) => n.id === selectedNodeId)?.name}</strong>
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Connect to:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    connectNodes(selectedNodeId, e.target.value);
                    e.target.value = "";
                  }
                }}
                className="px-2 py-1 rounded-lg bg-muted border border-border text-foreground text-xs"
                defaultValue=""
              >
                <option value="" disabled>Choose target node...</option>
                {nodes
                  .filter((n) => n.id !== selectedNodeId)
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.type})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => deleteNode(selectedNodeId)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove Component
          </button>
        </div>
      )}
    </div>
  );
}
