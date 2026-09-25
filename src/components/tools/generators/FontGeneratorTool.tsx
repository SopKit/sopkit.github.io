"use client";

import React, { useState, useMemo } from "react";
import {
  ToolShell,
  ToolGrid,
  ToolGridMain,
  ToolGridSide,
  ToolPanel,
  ToolSectionTitle,
  ToolField,
  DS,
} from "@/components/tools/shared/design-system";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Type,
  Copy,
  Check,
  Sparkles,
  Instagram,
  Twitter,
  Search,
  SlidersHorizontal,
} from "lucide-react";

interface FontStyle {
  id: string;
  name: string;
  category: "all" | "script" | "bold" | "symbols" | "aesthetic";
  map?: string;
  transform?: (text: string) => string;
}

const NORMAL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const FONT_STYLES: FontStyle[] = [
  {
    id: "bold-serif",
    name: "Bold Serif",
    category: "bold",
    map: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  },
  {
    id: "bold-sans",
    name: "Bold Sans-Serif",
    category: "bold",
    map: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
  },
  {
    id: "italic-serif",
    name: "Italic Serif",
    category: "script",
    map: "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧0123456789",
  },
  {
    id: "bold-italic",
    name: "Bold Italic",
    category: "bold",
    map: "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝱲𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛0123456789",
  },
  {
    id: "script",
    name: "Cursive Script",
    category: "script",
    map: "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏0123456789",
  },
  {
    id: "bold-script",
    name: "Bold Calligraphy",
    category: "script",
    map: "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃0123456789",
  },
  {
    id: "fraktur",
    name: "Gothic / Fraktur",
    category: "bold",
    map: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷0123456789",
  },
  {
    id: "double-struck",
    name: "Double-Struck / Blackboard",
    category: "symbols",
    map: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
  },
  {
    id: "monospace",
    name: "Code Monospace",
    category: "aesthetic",
    map: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
  },
  {
    id: "circled",
    name: "Circled Bubbles",
    category: "symbols",
    map: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨",
  },
  {
    id: "squared",
    name: "Squared Blocks",
    category: "symbols",
    map: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789",
  },
  {
    id: "small-caps",
    name: "Aesthetic Small Caps",
    category: "aesthetic",
    map: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ0123456789",
  },
  {
    id: "vaporwave",
    name: "Fullwidth / Vaporwave",
    category: "aesthetic",
    map: "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９",
  },
  {
    id: "strikethrough",
    name: "Strikethrough Cross",
    category: "aesthetic",
    transform: (text) => [...text].map((c) => `${c}\u0336`).join(""),
  },
  {
    id: "underline",
    name: "Double Underline",
    category: "aesthetic",
    transform: (text) => [...text].map((c) => `${c}\u0333`).join(""),
  },
  {
    id: "sparkles",
    name: "Sparkle Enclosed",
    category: "aesthetic",
    transform: (text) => `✨ ${text} ✨`,
  },
];

function convertByMap(text: string, targetMap: string): string {
  const chars = Array.from(targetMap);
  return Array.from(text)
    .map((ch) => {
      const idx = NORMAL.indexOf(ch);
      return idx >= 0 && idx < chars.length ? chars[idx] : ch;
    })
    .join("");
}

export default function FontGeneratorTool() {
  const [input, setInput] = useState("Aesthetic Instagram Bio");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const renderedFonts = useMemo(() => {
    const raw = input || "Type something...";
    return FONT_STYLES.map((style) => {
      let outputText = "";
      if (style.transform) {
        outputText = style.transform(raw);
      } else if (style.map) {
        outputText = convertByMap(raw, style.map);
      }
      return {
        id: style.id,
        name: style.name,
        category: style.category,
        text: outputText,
      };
    }).filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [input, activeCategory, searchQuery]);

  const copyFont = (fontId: string, text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(fontId);
    toast.success(`Copied ${name} style!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <ToolShell>
      <ToolGrid>
        {/* Left Side: Input & Settings */}
        <ToolGridSide>
          <ToolPanel className="space-y-5">
            <ToolSectionTitle
              title="Text Input"
              subtitle="Type your message, username, or caption to generate Unicode styles"
            />

            <ToolField
              label="Your Message or Bio"
              hint="Works with letters, numbers, and basic punctuation"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to style..."
                className="min-h-[110px] text-base rounded-xl font-sans"
              />
            </ToolField>

            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>{input.length} characters</span>
              <span>{input.trim() ? input.trim().split(/\s+/).length : 0} words</span>
            </div>

            {/* Quick Templates */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <Label className="text-xs font-semibold text-foreground">Sample Prompts</Label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Living my dream ✨",
                  "Digital Creator 📸",
                  "Link in bio 🔗",
                  "Do not disturb 🌙",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setInput(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-border/60 bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative pt-2">
              <Search className="absolute left-3 top-5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by font name..."
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>
          </ToolPanel>
        </ToolGridSide>

        {/* Right Side: Output Gallery */}
        <ToolGridMain>
          <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: "all", label: "All Fonts" },
                  { id: "script", label: "Cursive & Script" },
                  { id: "bold", label: "Bold & Gothic" },
                  { id: "aesthetic", label: "Aesthetic" },
                  { id: "symbols", label: "Symbols & Blocks" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      activeCategory === tab.id
                        ? "bg-foreground text-background border-foreground font-semibold"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {renderedFonts.length} styles
              </span>
            </div>

            {/* Font Cards */}
            <div className="grid gap-2.5">
              {renderedFonts.map((font) => {
                const isCopied = copiedId === font.id;
                return (
                  <div
                    key={font.id}
                    onClick={() => copyFont(font.id, font.text, font.name)}
                    className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-all ${
                      isCopied
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "bg-card/60 hover:bg-card border-border/60 hover:border-primary/40 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {font.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-muted/60 text-muted-foreground/80 font-mono">
                          Unicode
                        </span>
                      </div>
                      <div className="text-base sm:text-lg text-foreground break-all leading-normal">
                        {font.text}
                      </div>
                    </div>
                    <Button
                      variant={isCopied ? "default" : "outline"}
                      size="sm"
                      className="h-8 gap-1.5 text-xs rounded-xl shrink-0 transition-opacity"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-background" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}

              {renderedFonts.length === 0 && (
                <div className="text-center py-12 border border-dashed rounded-2xl border-border/60">
                  <Type className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No font styles found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </ToolGridMain>
      </ToolGrid>
    </ToolShell>
  );
}
