"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Upload, 
    Download, 
    Server,
    Loader2,
    ShieldCheck,
    Check,
    Copy,
    Trash2,
    Settings,
    Grid,
    Sparkles,
    Plus,
    X,
    Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface McpToolDef {
    name: string;
    description: string;
    paramName: string;
    paramType: string;
    paramDesc: string;
}

export default function McpServerTool() {
    const [serverName, setServerName] = useState("my-custom-mcp");
    const [serverDescription, setServerDescription] = useState("A custom Model Context Protocol server");
    const [language, setLanguage] = useState<"typescript" | "python">("typescript");
    const [transport, setTransport] = useState<"stdio" | "sse">("stdio");
    const [toolsList, setToolsList] = useState<McpToolDef[]>([
        { name: "get_weather", description: "Gets the weather for a location", paramName: "location", paramType: "string", paramDesc: "City and state, e.g. San Francisco, CA" }
    ]);

    const [generatedCode, setGeneratedCode] = useState("");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const addToolDef = () => {
        if (toolsList.length >= 6) {
            toast.error("Limit of 6 tools for boilerplate generation.");
            return;
        }
        setToolsList([...toolsList, { name: "new_tool", description: "Description", paramName: "arg1", paramType: "string", paramDesc: "Description" }]);
    };

    const removeToolDef = (index: number) => {
        if (toolsList.length <= 1) return;
        setToolsList(toolsList.filter((_, i) => i !== index));
    };

    const updateToolDef = (index: number, field: keyof McpToolDef, val: string) => {
        const updated = [...toolsList];
        updated[index] = { ...updated[index], [field]: val };
        setToolsList(updated);
    };

    const generateCodeOutput = useCallback(() => {
        if (!serverName.trim()) {
            setGeneratedCode("");
            return;
        }

        const timestamp = new Date().toISOString();
        let code = "";

        if (language === "typescript") {
            code = `// ${serverName} - Model Context Protocol (MCP) Server
// Generated dynamically on sopkit.github.io
// Date: ${timestamp}

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ${transport === "stdio" ? "StdioServerTransport" : "SSEServerTransport"} } from "@modelcontextprotocol/sdk/server/${transport}.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from "@modelcontextprotocol/sdk/types.js";

// Initialize MCP Server
const server = new Server(
  {
    name: "${serverName}",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define Tools
const TOOLS = [
${toolsList.map(t => `  {
    name: "${t.name}",
    description: "${t.description}",
    inputSchema: {
      type: "object",
      properties: {
        ${t.paramName}: {
          type: "${t.paramType}",
          description: "${t.paramDesc}",
        },
      },
      required: ["${t.paramName}"],
    },
  }`).join(",\n")}
];

// Register List Tools Handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Register Call Tool Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
${toolsList.map(t => `      case "${t.name}": {
        if (!args || typeof args.${t.paramName} !== "${t.paramType}") {
          throw new McpError(ErrorCode.InvalidParams, "Missing parameter: ${t.paramName}");
        }
        // TODO: Implement your tool logic here
        const result = \`Processed ${t.name} with \${args.${t.paramName}}\`;
        return {
          content: [{ type: "text", text: result }],
        };
      }`).join("\n")}
      default:
        throw new McpError(ErrorCode.MethodNotFound, \`Tool \${name} not found\`);
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: error.message || "Internal Error" }],
    };
  }
});

// Start Server Transport
async function run() {
  const transport = new ${transport === "stdio" ? "StdioServerTransport" : "SSEServerTransport"}();
  await server.connect(transport);
  console.error("${serverName} MCP server running on ${transport.toUpperCase()}");
}

run().catch(console.error);
`;
        } else {
            // Python MCP Server
            code = `# ${serverName} - Model Context Protocol (MCP) Server
# Generated dynamically on sopkit.github.io
# Date: ${timestamp}

import asyncio
from mcp.server.models import InitializationOptions
import mcp.types as types
from mcp.server import NotificationOptions, Server
import mcp.server.stdio

# Initialize MCP Server
server = Server("${serverName}")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """List available tools."""
    return [
${toolsList.map(t => `        types.Tool(
            name="${t.name}",
            description="${t.description}",
            inputSchema={
                "type": "object",
                "properties": {
                    "${t.paramName}": {
                        "type": "${t.paramType}",
                        "description": "${t.paramDesc}",
                    }
                },
                "required": ["${t.paramName}"],
            },
        )`).join(",\n")}
    ]

@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict | None
) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    """Execute tool calls."""
    if not arguments:
        raise ValueError("Missing arguments")

    try:
${toolsList.map((t, idx) => `        ${idx === 0 ? "if" : "elif"} name == "${t.name}":
            val = arguments.get("${t.paramName}")
            if not val:
                raise ValueError("Missing required parameter: ${t.paramName}")
            
            # TODO: Implement your tool logic here
            return [types.TextContent(type="text", text=f"Processed ${t.name} with {val}")]`).join("\n")}
        else:
            raise ValueError(f"Unknown tool: {name}")
            
    except Exception as e:
        return [types.TextContent(type="text", text=f"Error: {str(e)}")]

async def main():
    # Run the server using stdin/stdout streams
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="${serverName}",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )

if __name__ == "__main__":
    asyncio.run(main())
`;
        }

        setGeneratedCode(code);
    }, [serverName, serverDescription, language, transport, toolsList]);

    useEffect(() => {
        generateCodeOutput();
    }, [serverName, serverDescription, language, transport, toolsList, generateCodeOutput]);

    const copyToClipboard = async () => {
        if (!generatedCode) return;
        try {
            await navigator.clipboard.writeText(generatedCode);
            setCopiedFormat("copied");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("Boilerplate code copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const downloadCode = () => {
        if (!generatedCode) return;
        const ext = language === "typescript" ? "ts" : "py";
        const blob = new Blob([generatedCode], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `server.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Code template generation runs locally in browser RAM. No payloads are stored or logged.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Server className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">MCP Server Template Generator</h2>
                        <p className="text-xs text-muted-foreground">Generate Model Context Protocol (MCP) server templates in TypeScript or Python locally</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Settings */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> Server Details
                        </h4>

                        <div className="space-y-3.5">
                            <div className="space-y-1.5">
                                <Label htmlFor="server-name-input" className="text-[10px] text-muted-foreground uppercase">Server Name</Label>
                                <Input 
                                    id="server-name-input"
                                    type="text"
                                    value={serverName}
                                    onChange={(e) => setServerName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                                    className="h-9 text-xs border-border/30 bg-background/50 font-bold"
                                    placeholder="my-custom-mcp"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="lang-select" className="text-[10px] text-muted-foreground uppercase">Language</Label>
                                <select
                                    id="lang-select"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as any)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="typescript">TypeScript (Node.js)</option>
                                    <option value="python">Python</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="transport-select" className="text-[10px] text-muted-foreground uppercase">Transport Type</Label>
                                <select
                                    id="transport-select"
                                    value={transport}
                                    onChange={(e) => setTransport(e.target.value as any)}
                                    disabled={language === "python"}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs disabled:opacity-40"
                                >
                                    <option value="stdio">Stdio (Standard I/O Streams)</option>
                                    <option value="sse">SSE (Server-Sent Events)</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Tools Definition Card */}
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <div className="flex justify-between items-center border-b border-border/10 pb-2">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <Grid className="w-3.5 h-3.5" /> Tools Definitions
                            </h4>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={addToolDef}
                                disabled={toolsList.length >= 6}
                                className="h-7 text-[10px] font-bold text-primary hover:bg-muted"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1" /> Add Tool
                            </Button>
                        </div>

                        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                            {toolsList.map((t, idx) => (
                                <div key={idx} className="p-3 border border-border/20 rounded-xl bg-background/40 space-y-2 relative">
                                    <div className="flex gap-2">
                                        <Input 
                                            value={t.name}
                                            onChange={(e) => updateToolDef(idx, "name", e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                                            placeholder="Tool Name"
                                            className="h-7 text-[10px] border-border/20 font-bold"
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeToolDef(idx)}
                                            disabled={toolsList.length <= 1}
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0 rounded-lg"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                    <Input 
                                        value={t.description}
                                        onChange={(e) => updateToolDef(idx, "description", e.target.value)}
                                        placeholder="Description"
                                        className="h-7 text-[10px] border-border/20"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input 
                                            value={t.paramName}
                                            onChange={(e) => updateToolDef(idx, "paramName", e.target.value.replace(/[^a-zA-Z0-9_$]/g, ""))}
                                            placeholder="Param Name"
                                            className="h-7 text-[10px] border-border/20 font-mono"
                                        />
                                        <select
                                            value={t.paramType}
                                            onChange={(e) => updateToolDef(idx, "paramType", e.target.value)}
                                            className="h-7 px-2 rounded border border-border/25 bg-background text-[9px] font-bold"
                                        >
                                            <option value="string">string</option>
                                            <option value="number">number</option>
                                            <option value="boolean">boolean</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Boilerplate Output Preview Panel */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <div className="flex justify-between items-center border-b border-border/10 pb-2">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <Code className="w-3.5 h-3.5 text-primary" /> Generated Code
                            </h4>
                            <div className="flex gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={copyToClipboard}
                                    className="h-6 text-[9px] font-bold px-2 rounded border hover:bg-muted"
                                >
                                    {copiedFormat === "copied" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={downloadCode}
                                    className="h-6 text-[9px] font-bold px-2 rounded border hover:bg-muted"
                                >
                                    <Download className="w-3 h-3 text-primary" />
                                </Button>
                            </div>
                        </div>

                        <Textarea 
                            readOnly 
                            value={generatedCode} 
                            className="font-mono text-[11px] h-[480px] bg-background/50 border-border/30 resize-none rounded-xl p-4 leading-relaxed"
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
}
